import { INVALID_AMOUNT_MSG, INVALID_CURRENCY_MSG, INVALID_PAYMENT_DESCRIPTION_MSG, INVALID_PAYMENT_TIMESTAMP_MSG } from "./constants";

export function validateBody(paymentTimestamp: string, paymentDescription: string, currency: string, amount: number): string | true {

    //validate time by using getTime to get milliseconds of timestamp value passed
    const parsedDate = new Date(paymentTimestamp).getTime();
    if(parsedDate <= 0 || isNaN(parsedDate)){
        return INVALID_PAYMENT_TIMESTAMP_MSG;
    }

    if(!paymentDescription || typeof paymentDescription !== 'string'){
        return INVALID_PAYMENT_DESCRIPTION_MSG;
    }

    if(!currency || typeof currency !== 'string'){
        return INVALID_CURRENCY_MSG;
    }

    if(typeof amount !== 'number' || amount < 0){
        return INVALID_AMOUNT_MSG;
    }

    return true;
}