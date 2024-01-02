import * as cdk from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

const lambda = require("aws-cdk-lib/aws-lambda");
const apigateway = require("aws-cdk-lib/aws-apigateway");

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const getGenericTournamentsLambdaFn = new lambda.Function(this, 'GetGenericTournamentsLambda', {
      functionName: "GetGenericTournaments",
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("../src"),
      handler: "get_generic_tournaments.handler",
      environment: {
      }
    });

    const getCustomizedTournamentsLambdaFn = new lambda.Function(this, 'GetCustomizedTournamentsLambda', {
      functionName: "GetCustomizedTournaments",
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("../src"),
      handler: "get_customized_tournaments.handler",
      environment: {
      }
    });

    for (const fn of [getGenericTournamentsLambdaFn, getCustomizedTournamentsLambdaFn]) {
      fn.addToRolePolicy(new PolicyStatement({
        actions: ['dynamodb:*'],
        effect: Effect.ALLOW,
        resources: ['*']
      }));
    }

    const api = new apigateway.RestApi(this, "ATPPredictionsService", {
      restApiName: "ATPPredictionsService",
      description: "Provides APIs for saving and fetching API predictions"
    });

    const getGenericTournamentsResource = api.root.addResource('get_generic_tournaments');
    getGenericTournamentsResource.addMethod('GET', new apigateway.LambdaIntegration(getGenericTournamentsLambdaFn, {
      requestTemplates: { "text/html": '{ "statusCode": "200"}' }
    }));
    
    const getCustomizedTournamentsResource = api.root.addResource('get_customized_tournaments');
    getCustomizedTournamentsResource.addMethod('GET', new apigateway.LambdaIntegration(getCustomizedTournamentsLambdaFn, {
      requestTemlates: { "text/html": '{ "statusCode": "200"}' }
    }));
  }
}
