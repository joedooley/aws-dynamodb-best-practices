import { CreateTableCommand } from '@aws-sdk/client-dynamodb';

import ddClient from '../../client/ddbClient';
import { ADJACENCY_INVOICEBILLS_TABLE_NAME } from '../../utils/constants';

const params = {
  AttributeDefinitions: [
    {
      AttributeName: 'PK',
      AttributeType: 'S',
    },
    {
      AttributeName: 'SK',
      AttributeType: 'S',
    },
  ],
  KeySchema: [
    {
      AttributeName: 'PK',
      KeyType: 'HASH',
    },
    {
      AttributeName: 'SK',
      KeyType: 'RANGE',
    },
  ],
  GlobalSecondaryIndexes: [
    // Allows for reverse lookup to the related entity.
    {
      IndexName: 'RelatedIdIndex',
      KeySchema: [
        {
          AttributeName: 'SK', // partitioned on SK attribute of the parent table - reuse SK as Key for GSI
          KeyType: 'HASH',
        },
      ],
      Projection: {
        ProjectionType: 'ALL',
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 100,
        WriteCapacityUnits: 100,
      },
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 100,
    WriteCapacityUnits: 100,
  },
  TableName: ADJACENCY_INVOICEBILLS_TABLE_NAME,
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
