import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { ORDERS_TABLE_NAME } from '../../utils/constants';

/**
 * This call allows you to make multiple (up to 25) PutItem and/or DeleteItem requests in a single call rather than making separate calls.
 * You can even make requests to different tables in a single call.
 */
const batchWriteOrders = async () => {
  try {
    const params = {
      RequestItems: {
        // up to 25 items
        [ORDERS_TABLE_NAME]: [
          {
            PutRequest: {
              Item: {
                Username: 'alexdebrie',
                OrderId: '20160630-12928', // format:  <OrderDate>-<RandomInteger>
                Amount: 142.23,
              },
            },
          },
          {
            PutRequest: {
              Item: {
                Username: 'daffyduck',
                OrderId: '20170608-10171',
                Amount: 18.95,
              },
            },
          },
          {
            PutRequest: {
              Item: {
                Username: 'daffyduck',
                OrderId: '20170609-25875',
                Amount: 116.86,
              },
            },
          },
          {
            PutRequest: {
              Item: {
                Username: 'daffyduck',
                OrderId: '20160630-28176',
                Amount: 88.3,
              },
            },
          },
          {
            PutRequest: {
              Item: {
                Username: 'yosemitesam',
                OrderId: '20170609-18618',
                Amount: 122.45,
              },
            },
          },
          {
            PutRequest: {
              Item: {
                Username: 'alexdebrie',
                OrderId: '20170609-4177',
                Amount: 27.89,
              },
            },
          },
          {
            PutRequest: {
              Item: {
                Username: 'alexdebrie',
                OrderId: '20170608-24041',
                Amount: 142.02,
              },
            },
          },
          {
            PutRequest: {
              Item: {
                Username: 'yosemitesam',
                OrderId: '20170609-17146',
                Amount: 114.0,
              },
            },
          },
          {
            PutRequest: {
              Item: {
                Username: 'yosemitesam',
                OrderId: '20170609-9476',
                Amount: 19.41,
              },
            },
          },
        ],
      },
    };

    const result = await ddbDocClient.send(new BatchWriteCommand(params));
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

batchWriteOrders();
