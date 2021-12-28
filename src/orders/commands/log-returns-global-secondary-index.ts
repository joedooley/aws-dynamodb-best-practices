import { ScanCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { ORDERS_TABLE_NAME } from '../../utils/constants';

const logReturnsGlobalIndex = async () => {
  try {
    const params = {
      TableName: ORDERS_TABLE_NAME,
      IndexName: 'ReturnDateOrderIdIndex',

      // FilterExpression: 'Username = :username',
      // ExpressionAttributeValues: {
      // ':username': 'daffyduck',
      // },
    };

    const result = await ddbDocClient.send(new ScanCommand(params));
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

logReturnsGlobalIndex();
