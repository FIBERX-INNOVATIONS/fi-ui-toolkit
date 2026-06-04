#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const packageJsonPath = path.join(projectRoot, 'package.json');
const lockfilePath = path.join(projectRoot, 'package-lock.json');
const nodeModulesPath = path.join(projectRoot, 'node_modules');

function loadPackageJson() {
  const raw = fs.readFileSync(packageJsonPath, 'utf8');
  return JSON.parse(raw);
}

function savePackageJson(json) {
  fs.writeFileSync(packageJsonPath, JSON.stringify(json, null, 4) + '\n', 'utf8');
}

function latestVersion(packageName) {
  try {
    const result = execSync(`npm view ${packageName} version`, {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
    return result;
  } catch (error) {
    throw new Error(`Unable to fetch latest version for ${packageName}: ${error.message}`);
  }
}

function updateSection(pkgJson, section) {
  if (!pkgJson[section]) {
    return;
  }

  const updated = {};
  for (const [pkg, version] of Object.entries(pkgJson[section])) {
    const prefix = version.startsWith('~') ? '~' : '^';
    const cleanVersion = latestVersion(pkg);
    updated[pkg] = `${prefix}${cleanVersion}`;
    console.log(`Updated ${section}.${pkg} -> ${updated[pkg]}`);
  }

  pkgJson[section] = updated;
}

function removePath(targetPath) {
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
    console.log(`Removed ${targetPath}`);
  }
}

function runNpmInstall() {
  console.log('Installing fresh dependencies...');
  execSync('npm install', {
    cwd: projectRoot,
    stdio: 'inherit',
  });
}

function main() {
  console.log('Refreshing package.json with latest dependency versions...');
  const pkgJson = loadPackageJson();

  updateSection(pkgJson, 'dependencies');
  updateSection(pkgJson, 'devDependencies');
  updateSection(pkgJson, 'optionalDependencies');
  updateSection(pkgJson, 'peerDependencies');

  savePackageJson(pkgJson);
  console.log('package.json updated.');

  removePath(nodeModulesPath);
  removePath(lockfilePath);

  runNpmInstall();

  console.log('\nDone. package.json has been updated, node_modules removed, and dependencies reinstalled.');
}

main();
