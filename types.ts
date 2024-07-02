export interface IPayment {
    paymentIdentifier?: string;
    userId?: string;
    paymentTimestamp: string;
    paymentDescription: string;
    currency: string;
    amount: number;
}

export interface IApiResponse {
    statusCode: number;
    body: string;
}