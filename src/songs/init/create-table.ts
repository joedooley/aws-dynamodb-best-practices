import { CreateTableCommand } from '@aws-sdk/client-dynamodb';

import ddClient from '../../client/ddbClient';
import { SONGS_TABLE_NAME } from '../../utils/constants';

// dynamodb JS datatypes - https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html

// set the parameters - https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_CreateTable.html

const params = {
  AttributeDefinitions: [
    {
      AttributeName: 'artist',
      AttributeType: 'S',
    },
    {
      AttributeName: 'song',
      AttributeType: 'S',
    },
  ],
  KeySchema: [
    {
      AttributeName: 'artist',
      KeyType: 'HASH', // primary partition key - used to distribute items across shards
    },
    {
      AttributeName: 'song',
      KeyType: 'RANGE', // primary sort key - used to order items with the same partition key
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  TableName: SONGS_TABLE_NAME,
};

const run = async () => {
  try {
    const data = await ddClient.send(new CreateTableCommand(params));
    console.log('Table Created', data);
    return data;
  } catch (err) {
    console.log('Error', err);
  }
};

run();
