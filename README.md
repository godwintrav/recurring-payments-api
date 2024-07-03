# Bits AWS Software Engineer Task

This is the solution for Godwin Odenigbo Bits Software Engineer Task.

## Documentation
Full Required Documentation can be found [here](documentation/README.md)


## Setup

Run `npm i` to install all required packages

Make sure you have `awscli` installed on your device and configured to your aws account. You can read on how to install and configure it here: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html


## Local

To run the app locally I used [Localstack](https://www.localstack.cloud/). You can read on how to install and configure it here: https://docs.localstack.cloud/getting-started/installation/

Go to your `~/.aws/credentials` and create a profile for localstack for example:
```text
[localstack]
aws_access_key_id=test
aws_secret_access_key=test
```

Also go to your `~/.aws/config` and create a profile for localstack for example:
```text
[profile localstack]
region=eu-west-2
output=json
endpoint_url=http://localhost:4566
```

Now start up docker and in the root directory run `docker-compose up` in a separate terminal. This starts localstack with docker.

Run `npm run localstack:bootstrap` to run the bootstrap command in localstack.

Run `npm run localstack:deploy` to run the deploy command and deploy the stack in localstack.

Now your endpoint is ready to be tested locally using localstack.

Note: To test your localstack endpoint you need an API Key required for authorization to be passed in the header of the request, to get that API Key you need to run the following command:
```sh
aws apigateway get-api-key --api-key <APIKEYID> --include-value --profile <YOUR-LOCALSTACK-PROFILE>
```
You will get a response in the following format like the example below:
```text
{
    "id": "tvznw0tft6",
    "value": "qjGboRvMaq8IRuOtYCa9g9hNd2eRhJyx1KCSPdaS",
    "name": "BitsAw-ApiKe-Hpoty14fI6X4",
    "enabled": true,
    "createdDate": "2024-07-02T17:38:10+01:00",
    "lastUpdatedDate": "2024-07-02T17:38:10+01:00",
    "stageKeys": [],
    "tags": {}
}
```

Copy the value from the response and store it somewhere safe. That value is the `X-API-KEY` required in your request header.

## Production

To run the app on AWS make sure you have setup aws and configured your account on your device as specified above in the Setup Section or read more [here](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

Run `npm run aws:bootstrap aws://<YOUR-AWS-ACCOUNT-ID>/<YOUR-AWS-REGION>` to run the bootstrap command for aws. You can read more about bootstrap [here](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping-env.html)

Run `npm run aws:deploy --profile <YOUR-PROFILE-NAME>` to run the deploy command and deploy the stack in aws.

Now your AWS endpoint is ready.

Note: To make a request to your aws production endpoint you need an API Key required for authorization to be passed in the header of the request, to get that API Key you need to run the following command:
```sh
aws apigateway get-api-key --api-key <APIKEYID> --include-value --profile <YOUR-AWS-PROFILE>
```
You will get a response in the following format like the example below:
```text
{
    "id": "tvznw0tft6",
    "value": "qjGboRvMaq8IRuOtYCa9g9hNd2eRhJyx1KCSPdaS",
    "name": "BitsAw-ApiKe-Hpoty14fI6X4",
    "enabled": true,
    "createdDate": "2024-07-02T17:38:10+01:00",
    "lastUpdatedDate": "2024-07-02T17:38:10+01:00",
    "stageKeys": [],
    "tags": {}
}
```

Copy the value from the response and store it somewhere safe. That value is the `X-API-KEY` required in your request header.

## Integration Tests

To run the integration tests you need to ensure localstack is running as the integration test uses localstack and you have run both the bootstrap and deploy command for localstack. You can see how to start up localstack and deploy from the `Local` section above.

Now run `npm run test:integration` in your root directory.

## Unit Tests

Run `npm run test:unit` for running unit tests

## Server Endpoints

URL: `https://a13bvy562h.execute-api.eu-west-2.amazonaws.com/prod`

Method: `POST`

PATH: `/payments`

JSON Body Example:
```
{
    "paymentTimestamp": "2024-08-01T12:34:56Z",
    "paymentDescription": "Gym",
    "currency": "Dollars",
    "amount": 500
}
```

Success Response: [ApiResponse](types.ts) Object and a status code `201`

Error Response: 
- Returns status `500` if there is an internal server error.
- Returns status `400` if body is not sent.
- Returns status `422` if body parameter is invalid.