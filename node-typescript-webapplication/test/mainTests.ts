//
// TODO: Write your unit tests for main.ts
//

import { assert } from "chai";

const a = 42;
const b = 12;

describe("Example tests", function () {
	it("A variable 'a' should be equal to 42", function () {
		assert.equal(a, 42, "Variable 'a' has incorrect value");
	});
	it("A variable 'b' should be equal to 42", function () {
		assert.equal(b, 42, "Variable 'b' has incorrect value");
	});
});
