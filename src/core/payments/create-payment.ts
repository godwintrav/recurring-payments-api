import { randomUUID} from 'crypto';
import { IApiResponse, IPayment } from '../../../types';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { validateBody } from '../../utils/validate-body';
import { MISSING_BODY_MSG, PAYMENT_RECORDED_MSG } from '../../utils/constants';

export const dynamodb = new DynamoDB({});

export async function createPayment(body: string | null): Promise<IApiResponse> {
  
  // If no body, return an error
  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: MISSING_BODY_MSG }),
    };
  }
  
  const paymentIdentifier = randomUUID(); 
  const userId = randomUUID();
  
  //parse the body
  const parsedBody = JSON.parse(body) as IPayment;
  
  const validationResult = validateBody(parsedBody.paymentTimestamp, parsedBody.paymentDescription, parsedBody.currency, parsedBody.amount);
  
  if(validationResult !== true){
    return {
      
      statusCode: 422,
      body: JSON.stringify({ message: validationResult }),
      
    };
  }
  
  parsedBody.paymentIdentifier = paymentIdentifier
  parsedBody.userId = userId;
  
  
  try{

    //no need to sanitize input as SQL injection not possible in NO-SQL database like dynamoDB
    await dynamodb.send(
      new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
          ...parsedBody
        }
      })
    );
  } catch (error) {
    const err = error as Error;
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
  
  return {
    statusCode: 201,
    body: JSON.stringify({ message:  PAYMENT_RECORDED_MSG }),
  };
  
}