// https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-dynamodb
// lib-dynamodb depends on @aws-sdk/client-dynamodb
// The document client simplifies working with items in Amazon DynamoDB by abstracting away the notion of attribute values.
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// To create document client you need to create DynamoDB client first
import ddbClient from './ddbClient';

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: false, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
};

const translateConfig = { marshallOptions, unmarshallOptions };

// Create the DynamoDB Document client.
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, translateConfig);

export default ddbDocClient;
