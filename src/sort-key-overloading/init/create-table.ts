import { CreateTableCommand } from '@aws-sdk/client-dynamodb';

import ddClient from '../../client/ddbClient';
import { OVERLOAD_SORTKEY_TABLE_NAME } from '../../utils/constants';

const params = {
  AttributeDefinitions: [
    {
      AttributeName: 'documentId',
      AttributeType: 'S',
    },
    {
      AttributeName: 'documentInfo', // we will overload this sort key with different info
      AttributeType: 'S',
    },
  ],
  KeySchema: [
    {
      AttributeName: 'documentId',
      KeyType: 'HASH', // primary partition key - used to distribute items across shards
    },
    {
      AttributeName: 'documentInfo',
      KeyType: 'RANGE', // primary sort key - used to order items with the same partition key
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  TableName: OVERLOAD_SORTKEY_TABLE_NAME,
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
