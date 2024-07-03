import * as cdk from 'aws-cdk-lib';
import { SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
export class VPCConstruct {
    public vpc: Vpc;
    public lambdaSecurityGroup: SecurityGroup;
    
    constructor(scope: Construct) {
        // Create VPC
        this.vpc = new cdk.aws_ec2.Vpc(scope, 'BitsAWSVpc', {
            maxAzs: 2,
            natGateways: 1,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'Public',
                    subnetType: cdk.aws_ec2.SubnetType.PUBLIC,
                },
                {
                    cidrMask: 24,
                    name: 'Private',
                    subnetType: cdk.aws_ec2.SubnetType.PRIVATE_WITH_EGRESS,
                }
            ]
        });
        
        // Create security group for Lambda to access DynamoDB
       this.lambdaSecurityGroup = new cdk.aws_ec2.SecurityGroup(scope, 'LambdaSG', {
            vpc: this.vpc,
            description: 'Allow Lambda to access DynamoDB',
            allowAllOutbound: false
        });
        
        this.lambdaSecurityGroup.addEgressRule(cdk.aws_ec2.Peer.ipv4('0.0.0.0/0'), cdk.aws_ec2.Port.tcp(443), 'Allow HTTPS outbound traffic');
        
        // Add VPC endpoint for DynamoDB
        this.vpc.addGatewayEndpoint('DynamoDbEndpoint', {
            service: cdk.aws_ec2.GatewayVpcEndpointAwsService.DYNAMODB
        });
        
        // Add VPC endpoint for API Gateway
        this.vpc.addInterfaceEndpoint('ApiGatewayEndpoint', {
            service: cdk.aws_ec2.InterfaceVpcEndpointAwsService.APIGATEWAY,
            subnets: {
                subnetType: cdk.aws_ec2.SubnetType.PRIVATE_WITH_EGRESS
            },
            securityGroups: [this.lambdaSecurityGroup]
        });
    }
}