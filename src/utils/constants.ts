export const INVALID_PAYMENT_TIMESTAMP_MSG = "Invalid Payment Timestamp";
export const INVALID_PAYMENT_DESCRIPTION_MSG = "Invalid Payment Description";
export const INVALID_CURRENCY_MSG = "Invalid Currency";
export const INVALID_AMOUNT_MSG = "Invalid Amount";
export const MISSING_BODY_MSG = "Missing body";
export const PAYMENT_RECORDED_MSG = "Payment Recorded";
export const INTERNAL_SERVER_ERROR = "Internal Server Error";

export const LOCALSTACK_CLIENT_CONFIG = {
    region: 'eu-west-2',
    endpoint: `http://${process.env.LOCALSTACK_HOST ?? process.env.LOCALSTACK_HOSTNAME ?? '0.0.0.0'}:4566`,
};