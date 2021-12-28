import { QueryCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { MOVIES_TABLE_NAME } from '../../utils/constants';

const logAttributeExists = async () => {
  try {
    const params = {
      KeyConditionExpression: '#year = :year',
      FilterExpression: 'attribute_exists(Info.#genres)',
      ExpressionAttributeNames: {
        '#year': 'Year',
        '#genres': 'genres',
      },
      ExpressionAttributeValues: {
        ':year': 2014,
      },
      TableName: MOVIES_TABLE_NAME,
    };

    const result = await ddbDocClient.send(new QueryCommand(params));
    console.log(result); // Count: 67 / ScannedCount: 68
  } catch (error) {
    console.error(error);
  }
};

logAttributeExists();
