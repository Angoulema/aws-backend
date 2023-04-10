import { ZodError } from "zod";
import { validateProductBody } from "../../src/utils/validate-product-body";

const testBody = {
  "productType": "Book",
  "currency": "GBP",
  "description": "a6f1577f1688663bbbfe04c0d47bf469a3440552",
  "price": 70,
  "productName": "Raising Steam",
  "quantity": 101
};
const wrongBody = {
  "productType": "Book",
  "currency": "GBP",
  "description": "a6f1577f1688663bbbfe04c0d47bf469a3440552",
  "price": 70,
  "productName": "Raising Steam",
};

describe('Validator', () => {
  it('returns body when validation passed', () => {
    const result = validateProductBody(JSON.stringify(testBody));

    expect(result).toBeTruthy();
  });
  it('throws an error when validation is not passed', () => {
    try {
      validateProductBody(JSON.stringify(wrongBody));
    } catch(err) {
      expect(err).toBeInstanceOf(ZodError);
    }
  });
});
