import {uuidv4} from './index'
import { expect } from "chai";
import "mocha";

describe("Test uuidv4", () => {
  it("test of test", () => {
    const u1 = uuidv4();
    const u2 = uuidv4();
    expect(u1, "uuidv4 тест уникальности").to.not.equal(u2);
  });
});

