import { INVALID_AMOUNT_MSG, INVALID_CURRENCY_MSG, INVALID_PAYMENT_DESCRIPTION_MSG, INVALID_PAYMENT_TIMESTAMP_MSG } from "../constants"
import { validateBody } from "../validate-body"

describe('validateBody', () => {
    const WRONG_DATE_FORMAT = "wrong-date-format";
    const CORRECT_DATE_FORMAT = "2024-08-01T12:34:56Z";
    const PAYMENT_DESCRIPTION = "iCloud";
    const CURRENCY = "Dollars";
    const AMOUNT = 200;
    it(`should return '${INVALID_PAYMENT_TIMESTAMP_MSG}' when invalid paymentTimestamp parameter passed`, () => {
        expect(validateBody(WRONG_DATE_FORMAT, PAYMENT_DESCRIPTION, CURRENCY, AMOUNT)).toBe(INVALID_PAYMENT_TIMESTAMP_MSG);
    });
    
    it(`should return '${INVALID_PAYMENT_DESCRIPTION_MSG}' when invalid paymentDescription parameter passed`, () => {
        expect(validateBody(CORRECT_DATE_FORMAT, "", CURRENCY, AMOUNT)).toBe(INVALID_PAYMENT_DESCRIPTION_MSG);
    });

    it(`should return '${INVALID_CURRENCY_MSG}' when invalid currency parameter passed`, () => {
        expect(validateBody(CORRECT_DATE_FORMAT, PAYMENT_DESCRIPTION, "", AMOUNT)).toBe(INVALID_CURRENCY_MSG);
    });

    it(`should return '${INVALID_AMOUNT_MSG}' when invalid amount parameter passed`, () => {
        expect(validateBody(CORRECT_DATE_FORMAT, PAYMENT_DESCRIPTION, CURRENCY, -20)).toBe(INVALID_AMOUNT_MSG);
    });

    it(`should return true when correct parameters passed`, () => {
        expect(validateBody(CORRECT_DATE_FORMAT, PAYMENT_DESCRIPTION, CURRENCY, AMOUNT)).toEqual(true);
    });
})