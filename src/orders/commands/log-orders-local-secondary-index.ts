import { QueryCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { ORDERS_TABLE_NAME } from '../../utils/constants';

const logOrdersSecondaryIndex = async () => {
  try {
    const params = {
      // You can only use an equals operator on your partition key
      KeyConditionExpression: 'Username = :username AND Amount > :amount',
      ExpressionAttributeValues: {
        ':username': 'daffyduck',
        ':amount': 100,
      },
      TableName: ORDERS_TABLE_NAME,
      IndexName: 'UserAmountIndex',
    };

    const result = await ddbDocClient.send(new QueryCommand(params));
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

logOrdersSecondaryIndex();
