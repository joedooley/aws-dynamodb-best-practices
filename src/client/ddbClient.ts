// AWS SDKV3 modularized packages, so you no longer need to include the whole aws-sdk
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html#modularized-packages

// DynamoDBClient is the full fledge client that supports all operations
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
const REGION = 'us-west-2';

const ddbClient = new DynamoDBClient({ region: REGION });

export default ddbClient;
