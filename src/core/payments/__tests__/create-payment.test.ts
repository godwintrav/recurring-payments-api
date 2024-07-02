import 'aws-sdk-client-mock-jest';
import { mockClient } from 'aws-sdk-client-mock';
import { createPayment, dynamodb } from "../create-payment";
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { INVALID_AMOUNT_MSG, INVALID_CURRENCY_MSG, INVALID_PAYMENT_DESCRIPTION_MSG, INVALID_PAYMENT_TIMESTAMP_MSG, MISSING_BODY_MSG, PAYMENT_RECORDED_MSG } from '../../../utils/constants';



describe('createPayment', () => {
    let mockBody: any;

    const dynamoDbMock = mockClient(dynamodb);

    beforeEach(() => {
        mockBody = {"paymentTimestamp": "2024-08-01T12:34:56Z","paymentDescription": "Gym","currency": "test-currency","amount": 100};
    });
    afterEach(() => {
        dynamoDbMock.reset();
    })
    it('should return 400 bad request if body is empty', async () => {
        const response = await createPayment("");
        expect(response).toEqual(expect.objectContaining({
            statusCode: 400,
            body: JSON.stringify({ message: MISSING_BODY_MSG }),
        }))
    });

    it('should return 422 bad request if body parameter paymentTimestamp is invalid', async () => {
        mockBody.paymentTimestamp = "abc";
        const response = await createPayment(JSON.stringify(mockBody));
        expect(response).toEqual(expect.objectContaining({
            statusCode: 422,
            body: JSON.stringify({ message: INVALID_PAYMENT_TIMESTAMP_MSG}),
        }))
    });

    it('should return 422 bad request if body parameter paymentDescription is invalid', async () => {
        mockBody.paymentDescription = 123;
        const response = await createPayment(JSON.stringify(mockBody));
        expect(response).toEqual(expect.objectContaining({
            statusCode: 422,
            body: JSON.stringify({ message: INVALID_PAYMENT_DESCRIPTION_MSG }),
        }))
    });

    it('should return 422 bad request if body parameter currency is invalid', async () => {
        mockBody.currency = 100;
        const response = await createPayment(JSON.stringify(mockBody));
        expect(response).toEqual(expect.objectContaining({
            statusCode: 422,
            body: JSON.stringify({ message: INVALID_CURRENCY_MSG }),
        }));
    });

    it('should return 422 bad request if body parameter amount is invalid', async () => {
        mockBody.amount = "100 thousand";
        const response = await createPayment(JSON.stringify(mockBody));
        expect(response).toEqual(expect.objectContaining({
            statusCode: 422,
            body: JSON.stringify({ message: INVALID_AMOUNT_MSG }),
        }));
    });

    it('should return 201 created if payment is recorded successfully', async () => {
        dynamoDbMock.on(PutCommand).resolves({});
        const response = await createPayment(JSON.stringify(mockBody));
        expect(response).toEqual(expect.objectContaining({
            statusCode: 201,
            body: JSON.stringify({ message: PAYMENT_RECORDED_MSG }),
        }));
        expect(dynamoDbMock).toHaveReceivedCommand(PutCommand);
    });

    it('should return 500 internal server error if unknown error occurs', async () => {
        const error = new Error("test-error");
        dynamoDbMock.on(PutCommand).rejects(error);
        const response = await createPayment(JSON.stringify(mockBody));
        expect(response).toEqual(expect.objectContaining({
            statusCode: 500,
            body: JSON.stringify({ message: error.message }),
        }));
    });
})