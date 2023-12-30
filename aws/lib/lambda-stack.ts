import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

const lambda = require("aws-cdk-lib/aws-lambda");
const apigateway = require("aws-cdk-lib/aws-apigateway");

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const handler = new lambda.Function(this, 'ATPPredictionsLambda', {
      functionName: "ATPPredictionsLambda",
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("../src"),
      handler: "index.handler",
      environment: {
      }
    });

    const api = new apigateway.RestApi(this, "ATPPredictionsService", {
      restApiName: "ATPPredictionsService",
      description: "Provides APIs for saving and fetching API predictions"
    })

    const integration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "text/html": '{ "statusCode": "200"}' }
    });

    api.root.addMethod("GET", integration)
  }
}
