import { CreateTableCommand } from '@aws-sdk/client-dynamodb';

import ddClient from '../../client/ddbClient';
import { MOVIES_TABLE_NAME } from '../../utils/constants';

/**
 * This table only defines neccessary attributes
 * When importing data, we will be adding additional attributes dynamically, which DynamoDB supports
 */
const params = {
  AttributeDefinitions: [
    {
      AttributeName: 'Year',
      AttributeType: 'N',
    },
    {
      AttributeName: 'Title',
      AttributeType: 'S',
    },
  ],
  KeySchema: [
    {
      AttributeName: 'Year',
      KeyType: 'HASH',
    },
    {
      AttributeName: 'Title',
      KeyType: 'RANGE',
    },
  ],

  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  TableName: MOVIES_TABLE_NAME,
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
