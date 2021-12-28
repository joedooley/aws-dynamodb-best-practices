import { QueryCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { MOVIES_TABLE_NAME } from '../../utils/constants';

// set is like an array except all values must unique and of the same type
// in this case we are using a string set for Info.directors
const logStringSetFilter = async () => {
  try {
    const params = {
      KeyConditionExpression: '#year = :year',
      FilterExpression: '#info.#directors = :directors',
      ExpressionAttributeNames: {
        '#year': 'Year',
        '#info': 'Info',
        '#directors': 'directors',
      },
      ExpressionAttributeValues: {
        ':year': 2014,
        ':directors': ['Christopher Nolan'],
      },
      TableName: MOVIES_TABLE_NAME,
    };

    const result = await ddbDocClient.send(new QueryCommand(params));
    console.log(result); // Count: 1 / ScannedCount: 68
  } catch (error) {
    console.error(error);
  }
};

logStringSetFilter();
