import * as cdk from 'aws-cdk-lib';
import { ApiKey, ApiKeySourceType, Cors, LambdaIntegration, RestApi, UsagePlan } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class BitsAwsTaskStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Create DynamoDB Table
    const dbTable = new Table(this, 'RecurringPaymentsTable', {
      partitionKey: {name: 'paymentIdentifier', type: AttributeType.STRING},
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    const recurringPaymentsApi = new RestApi(this, 'RecurringPaymentPostAPI', {
      restApiName: 'RecurringPaymentPostAPI',
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
      apiKeySourceType: ApiKeySourceType.HEADER
    });

    const apiKey = new ApiKey(this, 'ApiKey');

    const usagePlan = new UsagePlan(this, 'UsagePlan', {
      name: 'Usage Plan',
      apiStages: [
        {
          api: recurringPaymentsApi,
          stage: recurringPaymentsApi.deploymentStage
        }
      ]
    });

    usagePlan.addApiKey(apiKey);

    const recurringPaymentsLambda = new NodejsFunction(this, 'RecurringPaymentsLambda', {
      entry: 'resources/endpoints/payments.ts',
      handler: 'handler',
      environment: {
        TABLE_NAME: dbTable.tableName
      },
    });

    dbTable.grantWriteData(recurringPaymentsLambda);
    
    const recurringPaymentsResource = recurringPaymentsApi.root.addResource('payments');

    const recurringPaymentsIntegration = new LambdaIntegration(recurringPaymentsLambda);

    recurringPaymentsResource.addMethod('POST', recurringPaymentsIntegration, {apiKeyRequired: true});

    new cdk.CfnOutput(this, 'API KEY ID', {
      value: apiKey.keyId
    })

  }
}
