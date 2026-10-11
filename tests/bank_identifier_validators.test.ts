import assert from "node:assert/strict";
import { test } from "node:test";

import IbanValidator from "../src/version_3/validators/iban_validator";
import SwiftBicValidator from "../src/version_3/validators/swift_bic_validator";
import FieldValidator from "../src/version_3/validators/withdrawal_recipient_field_validator";
import Util from "../src/version_3/utils/withdrawal_recipient_form_util";

test("IBAN accepts lowercase and spaces, formats for display and rejects invalid checksums", () => {
    const value = " gb82 west 1234 5698 7654 32 ";

    assert.equal(IbanValidator.validate(value), "");
    assert.equal(IbanValidator.format(value), "GB82 WEST 1234 5698 7654 32");
    assert.equal(IbanValidator.validate("GB83WEST12345698765432"), "validation_iban_checksum_text");
    assert.equal(IbanValidator.validate("DE89370400440532013000"), "");
    assert.equal(IbanValidator.validate("NO9386011117947"), "");
});

test("IBAN validates country length before checksum and supports route restrictions", () => {
    assert.equal(IbanValidator.validate("GB82WEST1234569876543"), "validation_iban_length_text");
    assert.equal(IbanValidator.validate("ZZ82WEST12345698765432"), "validation_iban_country_text");
    assert.equal(IbanValidator.validate("GB82WEST12345698765432", ["DE"]), "validation_iban_route_text");
    assert.equal(IbanValidator.validate("GB82WEST12345698765432", []), "validation_iban_route_text");
    assert.equal(IbanValidator.validate("GB82WEßT12345698765432"), "validation_iban_characters_text");
    assert.equal(IbanValidator.validate("GB82WEST-12345698765432"), "validation_iban_characters_text");
});

test("BIC accepts 8 or 11 characters with the correct structure", () => {
    assert.equal(SwiftBicValidator.validate(" westgb2l "), "");
    assert.equal(SwiftBicValidator.validate("WESTGB2LXXX"), "");

    for (const value of ["WESTGB2LX", "WESTGB2LXX", "WESTGB2LXXXX"]) {
        assert.equal(SwiftBicValidator.validate(value), "validation_bic_length_text");
    }

    assert.equal(SwiftBicValidator.validate("W3STGB2L"), "validation_bic_structure_text");
    assert.equal(SwiftBicValidator.validate("WESTG12L"), "validation_bic_structure_text");
    assert.equal(SwiftBicValidator.validate("WEST GB2L"), "validation_bic_characters_text");
    assert.equal(SwiftBicValidator.validate("WEßTGB2L"), "validation_bic_characters_text");
});

test("field rules preserve optional and stored semantics, digit counts and selection restrictions", () => {
    assert.equal(FieldValidator.validate("", { key: "swift_code" }).status, true);
    assert.equal(FieldValidator.validate("", { key: "iban", required: true }).msg, "validation_required_text");
    assert.equal(FieldValidator.validate(undefined, { key: "iban", required: true }, true).status, true);
    assert.equal(FieldValidator.validate("", { key: "iban", required: true }, true).status, false);
    assert.equal(FieldValidator.validate("123", { key: "sort_code", digits: 6 }).msg, "validation_digit_count_text");
    assert.equal(FieldValidator.validate("bad", { key: "bank_code", options: ["001"] }).msg, "validation_option_text");
    assert.equal(FieldValidator.validate("long", { key: "description", max_length: 2 }).msg, "validation_max_length_text");
    assert.equal(FieldValidator.validate("gb82 west 1234 5698 7654 32", {
        key: "iban", max_length: 34, allowed_countries: ["GB"]
    }).status, true);
});

test("payloads normalize identifiers and omit edits that only change presentation", () => {
    const values = { iban: "gb82 west 1234 5698 7654 32", swift_code: " westgb2l " };
    const fields = [{ key: "iban" }, { key: "swift_code" }] as const;

    assert.deepEqual(Util.buildFormPayload(values, {}, [...fields], false), {
        iban: "GB82WEST12345698765432", swift_code: "WESTGB2L"
    });
    assert.deepEqual(Util.buildFormPayload(values, {
        iban: "GB82WEST12345698765432", swift_code: "WESTGB2L"
    }, [...fields], true), {});
});
