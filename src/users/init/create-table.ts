import { CreateTableCommand } from '@aws-sdk/client-dynamodb';

import ddClient from '../../client/ddbClient';
import { USERS_TABLE_NAME } from '../../utils/constants';

const params = {
  AttributeDefinitions: [
    {
      AttributeName: 'Username',
      AttributeType: 'S',
    },
  ],
  KeySchema: [
    {
      AttributeName: 'Username',
      KeyType: 'HASH', // primary partition key - used to distribute items across shards
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  TableName: USERS_TABLE_NAME,
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
