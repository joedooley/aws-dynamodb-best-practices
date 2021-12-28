import { UpdateTableCommand } from '@aws-sdk/client-dynamodb';
import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';

import ddClient from '../../client/ddbClient';
import ddbDocClient from '../../client/ddbDocClient';
import { ORDERS_TABLE_NAME } from '../../utils/constants';

/**
 * In this example, let's show how we might use a sparse index for our global secondary index.
 * A sparse index is when not every Item contains the attribute you're indexing.
 * Only Items with the attribute(s) matching the key schema for your index will be copied into the index, so you may end up with fewer Items in the index than in the underlying table.
 */
const params = {
  // An array of attributes that describe the key schema for the table and indexes.
  AttributeDefinitions: [
    {
      AttributeName: 'ReturnDate', // this is a sparse index because not all orders will have a ReturnDate
      AttributeType: 'S',
    },
    {
      AttributeName: 'OrderId', // orderId appears here even though it's already in create-table.ts because it is referenced below in the GSI
      AttributeType: 'S',
    },
  ],

  GlobalSecondaryIndexUpdates: [
    {
      Create: {
        IndexName: 'ReturnDateOrderIdIndex',
        KeySchema: [
          {
            AttributeName: 'ReturnDate',
            KeyType: 'HASH',
          },
          {
            AttributeName: 'OrderId',
            KeyType: 'RANGE',
          },
        ],
        // must define throughput for GSI
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
        Projection: {
          ProjectionType: 'KEYS_ONLY',
        },
      },
    },
  ],
  TableName: ORDERS_TABLE_NAME,
};

const returnOrdersItemParams = {
  RequestItems: {
    // up to 25 items
    [ORDERS_TABLE_NAME]: [
      {
        // If an item that has the same primary key as the new item already exists in the specified table, the new item completely replaces the existing item.
        // the orders below exist from batch-write-orders.ts but will be replaced
        PutRequest: {
          Item: {
            Username: 'alexdebrie',
            OrderId: '20160630-12928',
            Amount: 142.23,
            ReturnDate: '20160705',
          },
        },
      },
      {
        PutRequest: {
          Item: {
            Username: 'daffyduck',
            OrderId: '20170608-10171',
            Amount: 18.95,
            ReturnDate: '20170628',
          },
        },
      },
      {
        PutRequest: {
          Item: {
            Username: 'daffyduck',
            OrderId: '20170609-25875',
            Amount: 116.86,
            ReturnDate: '20170628',
          },
        },
      },
    ],
  },
};

const createGSI = async () => {
  try {
    // use ddb Client
    const data = await ddClient.send(new UpdateTableCommand(params));
    console.log('GSI Created', data);

    // use ddb Doc Client
    const result = await ddbDocClient.send(
      new BatchWriteCommand(returnOrdersItemParams)
    );
    console.log(result);

    return data;
  } catch (err) {
    console.log('Error', err);
  }
};

createGSI();
