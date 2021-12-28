import { QueryCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { ORDERS_TABLE_NAME } from '../../utils/constants';

const logOrdersBetweenDates = async () => {
  try {
    const params = {
      // You can only use an equals operator on your partition key
      KeyConditionExpression:
        'Username = :username AND OrderId BETWEEN :startdate AND :enddate',
      ExpressionAttributeValues: {
        ':username': 'daffyduck',
        ':startdate': '20170101',
        ':enddate': '20180101',
      },
      // ProjectionExpression: 'Amount, Username', // Use ProjectionExpression option to return only particular elements from an item
      TableName: ORDERS_TABLE_NAME,
      // Limit: 10, //The maximum number of items to evaluate (not necessarily the number of matching items). I
    };

    const result = await ddbDocClient.send(new QueryCommand(params));
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

logOrdersBetweenDates();
