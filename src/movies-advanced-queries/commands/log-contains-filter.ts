import { QueryCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { MOVIES_TABLE_NAME } from '../../utils/constants';

/**
 * Contains operator on a string attribute value
 */
const logContainsFilter = async () => {
  try {
    const params = {
      KeyConditionExpression: '#year = :year',
      FilterExpression: 'contains(#info.#plot, :plot)',
      ExpressionAttributeNames: {
        '#year': 'Year',
        '#info': 'Info',
        '#plot': 'plot',
      },
      ExpressionAttributeValues: {
        ':year': 2014,
        ':plot': 'woman',
      },
      TableName: MOVIES_TABLE_NAME,
    };

    const result = await ddbDocClient.send(new QueryCommand(params));
    console.log(result); // Count: 6 / ScannedCount: 68
  } catch (error) {
    console.error(error);
  }
};

logContainsFilter();
