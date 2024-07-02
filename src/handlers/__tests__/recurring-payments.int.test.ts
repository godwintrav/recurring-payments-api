import { APIGatewayClient, GetApiKeyCommand, GetApiKeysCommand, GetRestApisCommand } from '@aws-sdk/client-api-gateway';
import { LOCALSTACK_CLIENT_CONFIG } from '../../utils/constants';
import axios from 'axios';

describe('Lambda Handler integration test', () => {
    let API_URL: string;
    let apiKey: string;
    let mockBody: any;
    beforeAll(async () => {
        //GET API URL
        const client = new APIGatewayClient(LOCALSTACK_CLIENT_CONFIG);
        const response = await client.send(new GetRestApisCommand({}));
        const API_ID = response.items![0].id;

        //GET API KEY
        const getApiKeysResponse = await client.send(new GetApiKeysCommand({}));
        const api_id = getApiKeysResponse.items![0].id;
        const getApiKeyResponse = await client.send(new GetApiKeyCommand({apiKey: api_id, includeValue: true}));
        apiKey = getApiKeyResponse.value!;
        API_URL = `https://${API_ID}.execute-api.localhost.localstack.cloud:4566/prod/payments`;
    });

    beforeEach(() => {
        mockBody = {"paymentTimestamp": "2024-08-01T12:34:56Z","paymentDescription": "Gym","currency": "test-currency","amount": 100};
    })

    it('API should fail with status code 400 when api called with empty body', async () => {
        expect( async () => await axios.post(API_URL, "", {headers: {
            "X-API-KEY": apiKey
        }})).rejects.toThrow('Request failed with status code 400');
    });

    it('API should fail with status code 403 forbidden when unauthorized user makes a request', async () => {
        expect( async () => await axios.post(API_URL, {})).rejects.toThrow('Request failed with status code 403');
    });

    it('API should fail with status code 422 when api called with invalid parameter body', async () => {
        mockBody.paymentTimestamp = "wrong-date-format";
        expect( async () => await axios.post(API_URL, mockBody, {headers: {
            "X-API-KEY": apiKey
        }})).rejects.toThrow('Request failed with status code 422');
    });

    it('should return 201 created if payment is recorded successfully', async () => {
        const response = await axios.post(API_URL, mockBody, {headers: {
            "X-API-KEY": apiKey
        }});
        expect(response.status).toEqual(201);
    })
})