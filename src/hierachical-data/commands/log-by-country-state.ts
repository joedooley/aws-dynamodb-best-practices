import { QueryCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { STARBUCKS_LOCATIONS_TABLE_NAME } from '../../utils/constants';

const logByCountryState = async () => {
  try {
    const params = {
      KeyConditionExpression:
      'Country = :country AND begins_with(StateCityPostcode, :stateCityPostcode)',
    ExpressionAttributeValues: {
      ':country': 'US',
      // ':stateCityPostcode': 'FL',
      // ':stateCityPostcode': 'GA#ATLANTA',
      ':stateCityPostcode': 'GA#ATLANTA#30329'
    },
      TableName: STARBUCKS_LOCATIONS_TABLE_NAME,
      IndexName: 'StoreLocationIndex',
    };

    const result = await ddbDocClient.send(new QueryCommand(params));
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

logByCountryState();
