import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class DynamoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Dynamo table for storing predictions information
    const predictionsTable = new dynamodb.Table(this, 'Predictions', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      tableName: 'Predictions',
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
    });
  }
}
