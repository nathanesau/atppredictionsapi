import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

const lambda = require("aws-cdk-lib/aws-lambda");
const apigateway = require("aws-cdk-lib/aws-apigateway");

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const handler = new lambda.Function(this, 'HelloWorldLambda', {
      functionName: "HelloWorldLambda",
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("../src"),
      handler: "index.handler",
      environment: {
      }
    });

    const api = new apigateway.RestApi(this, "HelloWorldService", {
      restApiName: "Website Service",
      description: "This service serves traffic."
    })

    const integration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "text/html": '{ "statusCode": "200"}' }
    });

    api.root.addMethod("GET", integration)
  }
}
