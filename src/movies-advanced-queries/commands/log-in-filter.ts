import { QueryCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { MOVIES_TABLE_NAME } from '../../utils/constants';

/**
 * Info.rank is a number attribute value
 */
const logInFilter = async () => {
  try {
    const params = {
      KeyConditionExpression: '#year = :year',
      FilterExpression: '#info.#rank IN (:rank1, :rank2)',
      ExpressionAttributeNames: {
        '#year': 'Year',
        '#info': 'Info',
        '#rank': 'rank',
      },
      ExpressionAttributeValues: {
        ':year': 2014,
        ':rank1': 563,
        ':rank2': 72,
      },
      TableName: MOVIES_TABLE_NAME,
    };

    const result = await ddbDocClient.send(new QueryCommand(params));
    console.log(result); // Count: 2 / ScannedCount: 68
  } catch (error) {
    console.error(error);
  }
};

logInFilter();
