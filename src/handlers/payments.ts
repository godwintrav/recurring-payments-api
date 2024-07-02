import { APIGatewayProxyEvent } from 'aws-lambda';
import { createPayment } from '../handlers/payments/create-payment';

export const handler = async (event: APIGatewayProxyEvent) => {
    return await createPayment(event.body);  
};