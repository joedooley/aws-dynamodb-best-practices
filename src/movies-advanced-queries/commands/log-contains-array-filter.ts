import { QueryCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { MOVIES_TABLE_NAME } from '../../utils/constants';

/**
 * Info.genres is an array
 * When searching if an array contains 1 or more values, you must use the contains operator separated by OR
 */
const logTestFilter = async () => {
  try {
    const params = {
      KeyConditionExpression: '#year = :year',
      FilterExpression:
        'contains(#info.#genres, :genre1) OR contains(#info.#genres , :genre2)',
      ExpressionAttributeNames: {
        '#year': 'Year',
        '#info': 'Info',
        '#genres': 'genres',
      },
      ExpressionAttributeValues: {
        ':year': 2014,
        ':genre1': 'Sci-Fi',
        ':genre2': 'Mystery',
      },
      TableName: MOVIES_TABLE_NAME,
      ProjectionExpression: 'Title, Info.genres', // return Title and 1 nested property
    };

    const result = await ddbDocClient.send(new QueryCommand(params));
    console.log(result); // Count: 26 / ScannedCount: 68
  } catch (error) {
    console.error(error);
  }
};

logTestFilter();
