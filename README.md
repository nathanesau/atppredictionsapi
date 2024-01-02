# atppredictionsapi

## Local Testing

Run `npm start`. Use `nodemon` for debugging.

## AWS Instructions

Installing CDK (you'll also want to run `npm install`):

```
npm install -g aws-cdk
```

For initial setup of cdk app, I've run the following command:

```
cdk init app --language typescript
```

For initial setup for your account, you'll need to run `cdk bootstrap`:

```
cdk bootstrap
```

To list the available stacks, you can run the `cdk list` command:

```
cdk list
```

To check the diff for CDK (this should be done prior to deploying to make sure the changes are as you'd expected them to be):

```
# confirm no unexpected differences
cdk diff
```

For deploying the Dynamo stack:

```
cdk deploy ATPPredictionsDynamoStack
```

For deploying the Lambda stack, run the following command, which will use the code in `src/hello` folder.

```
cdk deploy ATPPredictionsLambdaStack
```

Trigger the lambda via an API call to API Gateway or using `aws lambda invoke`.

## References

* https://github.com/wikka/aws-cdk-demo