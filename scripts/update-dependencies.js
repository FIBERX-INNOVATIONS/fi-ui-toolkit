#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

/**
 * Updates a single-package npm project using two priorities:
 * 1. The resulting dependency tree must have zero known npm audit findings.
 * 2. Subject to that security requirement, direct dependencies should be as new as possible.
 *
 * Compatibility here means npm can resolve engines and peer dependencies. Detecting application
 * API or runtime breakage requires project-specific tests and is intentionally outside this script.
 */
class DependencyUpdater {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.packageJsonPath = path.join(projectRoot, 'package.json');
    this.lockfilePath = path.join(projectRoot, 'package-lock.json');
    this.nodeModulesPath = path.join(projectRoot, 'node_modules');
    this.sections = [
      'dependencies',
      'devDependencies',
      'optionalDependencies',
      'peerDependencies',
      'overrides',
    ];
  }

  runNpm(args, capture = false) {
    return execFileSync('npm', args, {
      cwd: this.projectRoot,
      encoding: 'utf8',
      stdio: capture ? ['pipe', 'pipe', 'ignore'] : 'inherit',
    });
  }

  loadPackageJson() {
    return JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
  }

  savePackageJson(pkgJson) {
    fs.writeFileSync(this.packageJsonPath, `${JSON.stringify(pkgJson, null, 4)}\n`, 'utf8');
  }

  snapshotFiles() {
    return {
      packageJson: fs.readFileSync(this.packageJsonPath),
      lockfile: fs.existsSync(this.lockfilePath) ? fs.readFileSync(this.lockfilePath) : null,
    };
  }

  restoreFiles(snapshot) {
    fs.writeFileSync(this.packageJsonPath, snapshot.packageJson);
    if (snapshot.lockfile) {
      fs.writeFileSync(this.lockfilePath, snapshot.lockfile);
    } else if (fs.existsSync(this.lockfilePath)) {
      fs.rmSync(this.lockfilePath);
    }
  }

  removeNodeModules() {
    if (!fs.existsSync(this.nodeModulesPath)) return;

    // Remove only this project's resolved node_modules directory.
    fs.rmSync(this.nodeModulesPath, { recursive: true, force: true });
    console.log('Removed node_modules for a clean installation.');
  }

  validateProject() {
    const pkgJson = this.loadPackageJson();
    if (pkgJson.packageManager && !pkgJson.packageManager.startsWith('npm@')) {
      throw new Error(`This script supports npm projects, not ${pkgJson.packageManager}.`);
    }
    if (pkgJson.workspaces) {
      throw new Error('npm workspaces require workspace-aware dependency analysis.');
    }
  }

  isRegistryVersion(range) {
    return typeof range === 'string' && /^(?:\^|~)?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(range);
  }

  versionPrefix(range) {
    if (range.startsWith('~')) return '~';
    if (range.startsWith('^')) return '^';
    return '';
  }

  safePrefixForCandidate(currentRange, version, latestVersion) {
    const prefix = this.versionPrefix(currentRange);
    if (version === latestVersion || !prefix) return prefix;

    const [candidateMajor, candidateMinor] = version.split('.').map(Number);
    const [latestMajor, latestMinor] = latestVersion.split('.').map(Number);

    // Keep a range only when it cannot include the newer rejected release.
    if (prefix === '^' && candidateMajor !== latestMajor) return prefix;
    if (prefix === '~' && (candidateMajor !== latestMajor || candidateMinor !== latestMinor)) {
      return prefix;
    }
    return '';
  }

  compareVersionsDescending(left, right) {
    const leftParts = left.split('.').map(Number);
    const rightParts = right.split('.').map(Number);
    for (let index = 0; index < 3; index += 1) {
      if (leftParts[index] !== rightParts[index]) return rightParts[index] - leftParts[index];
    }
    return 0;
  }

  getStableVersions(packageName) {
    const output = this.runNpm(['view', packageName, 'versions', '--json'], true);
    const versions = JSON.parse(output);
    const list = Array.isArray(versions) ? versions : [versions];

    // Pre-releases are not considered "latest stable" dependency candidates.
    return list
      .filter((version) => /^\d+\.\d+\.\d+$/.test(version))
      .sort((left, right) => this.compareVersionsDescending(left, right));
  }

  collectPackageNames(pkgJson) {
    const names = new Set();
    for (const section of this.sections) {
      for (const [packageName, range] of Object.entries(pkgJson[section] ?? {})) {
        // Nested overrides and non-registry specifications are left unchanged.
        if (this.isRegistryVersion(range)) names.add(packageName);
      }
    }
    return [...names];
  }

  applyVersion(pkgJson, packageName, version, latestVersion) {
    const changes = [];
    for (const section of this.sections) {
      const currentRange = pkgJson[section]?.[packageName];
      if (!this.isRegistryVersion(currentRange)) continue;

      // Pin only when the old range could select a newer rejected release.
      const prefix = this.safePrefixForCandidate(currentRange, version, latestVersion);
      const updatedRange = `${prefix}${version}`;
      if (updatedRange !== currentRange) {
        pkgJson[section][packageName] = updatedRange;
        changes.push(`${section}: ${currentRange} -> ${updatedRange}`);
      }
    }

    this.updateAllowedScriptVersion(pkgJson, packageName, version);
    return changes;
  }

  updateAllowedScriptVersion(pkgJson, packageName, version) {
    if (!pkgJson.allowScripts) return;

    const currentKey = Object.keys(pkgJson.allowScripts).find((key) => {
      const separator = key.lastIndexOf('@');
      return separator > 0 && key.slice(0, separator) === packageName;
    });
    if (!currentKey) return;

    const updatedKey = `${packageName}@${version}`;
    pkgJson.allowScripts[updatedKey] = pkgJson.allowScripts[currentKey];
    if (updatedKey !== currentKey) delete pkgJson.allowScripts[currentKey];
  }

  resolveLockfile() {
    // Strict peer checking rejects dependency combinations npm knows are incompatible.
    this.runNpm(['install', '--package-lock-only', '--ignore-scripts', '--strict-peer-deps'], true);
  }

  getAuditState() {
    let output;
    try {
      output = this.runNpm(['audit', '--json'], true);
    } catch (error) {
      // npm audit exits non-zero when it finds a vulnerability; its JSON remains usable.
      output = error.stdout;
    }

    const vulnerabilities = JSON.parse(output).metadata?.vulnerabilities;
    if (!Number.isInteger(vulnerabilities?.total)) {
      throw new Error('npm audit did not return a vulnerability summary.');
    }

    return {
      total: vulnerabilities.total,
      risk:
        (vulnerabilities.low ?? 0) +
        (vulnerabilities.moderate ?? 0) * 10 +
        (vulnerabilities.high ?? 0) * 100 +
        (vulnerabilities.critical ?? 0) * 1000,
    };
  }

  applySafeAuditFixes() {
    try {
      // Never use --force: npm must not make uncontrolled breaking changes.
      this.runNpm(['audit', 'fix', '--package-lock-only', '--ignore-scripts'], true);
    } catch (error) {
      // Remaining findings are handled by explicit version searches below.
    }
  }

  findBestCandidate(packageName, currentAuditState) {
    const versions = this.getStableVersions(packageName);
    const latestVersion = versions[0];
    if (!latestVersion) return null;

    for (const version of versions) {
      const candidateSnapshot = this.snapshotFiles();
      const pkgJson = this.loadPackageJson();
      const changes = this.applyVersion(pkgJson, packageName, version, latestVersion);
      if (changes.length === 0) return null;

      try {
        this.savePackageJson(pkgJson);
        this.resolveLockfile();
        const auditState = this.getAuditState();

        // Security comes first: never accept a candidate that raises weighted audit risk.
        if (auditState.risk <= currentAuditState.risk) {
          return { version, latestVersion, changes, auditState };
        }
      } catch (error) {
        // Try the next newest published stable version.
      }

      this.restoreFiles(candidateSnapshot);
    }

    return null;
  }

  updateDependencies(initialAuditState) {
    const packageNames = this.collectPackageNames(this.loadPackageJson());
    let auditState = initialAuditState;
    let accepted = 0;
    let retained = 0;

    for (const packageName of packageNames) {
      const originalSnapshot = this.snapshotFiles();
      try {
        const candidate = this.findBestCandidate(packageName, auditState);
        if (!candidate) continue;

        auditState = candidate.auditState;
        accepted += 1;
        const label = candidate.version === candidate.latestVersion ? 'latest' : 'secure fallback';
        console.log(
          `Accepted ${packageName}@${candidate.version} (${label}); ${auditState.total} findings remain.`,
        );
      } catch (error) {
        this.restoreFiles(originalSnapshot);
        retained += 1;
        console.warn(`Retained ${packageName}: no safer compatible candidate was found.`);
      }
    }

    return { accepted, retained };
  }

  installAndRequireZeroAudit() {
    // Finalize safe lockfile changes before performing the clean installation.
    this.applySafeAuditFixes();

    this.removeNodeModules();
    this.runNpm(['ci', '--strict-peer-deps']);

    const finalAuditState = this.getAuditState();
    if (finalAuditState.total !== 0) {
      throw new Error(`Unable to reach zero vulnerabilities; ${finalAuditState.total} remain.`);
    }
  }

  run() {
    console.log('Updating dependencies with security as the highest priority...\n');
    const projectSnapshot = this.snapshotFiles();

    try {
      // Step 1: validate scope and create an auditable baseline lockfile.
      this.validateProject();
      this.resolveLockfile();

      // Step 2: apply npm's non-breaking remediations before changing direct dependencies.
      this.applySafeAuditFixes();
      const initialAuditState = this.getAuditState();
      console.log(`Starting with ${initialAuditState.total} known vulnerabilities.`);

      // Step 3: choose the newest candidate per package that does not worsen security.
      const result = this.updateDependencies(initialAuditState);

      // Step 4: install the selected tree and reject the entire update unless audit reaches zero.
      this.installAndRequireZeroAudit();
      console.log(`\nDone. Updated ${result.accepted} packages and retained ${result.retained}.`);
      console.log('The installed dependency tree has zero known npm audit vulnerabilities.');
    } catch (error) {
      console.error(`\nUpdate rejected: ${error.message}`);
      console.error('Restoring the original package.json and package-lock.json...');
      this.restoreFiles(projectSnapshot);

      try {
        this.runNpm(['install', '--strict-peer-deps']);
      } catch (restoreError) {
        console.error(`Dependency restoration also failed: ${restoreError.message}`);
      }
      process.exitCode = 1;
    }
  }
}

new DependencyUpdater(path.resolve(__dirname, '..')).run();
