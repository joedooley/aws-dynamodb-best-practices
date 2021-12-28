import { GetCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { STARBUCKS_LOCATIONS_TABLE_NAME } from '../../utils/constants';

const logSingleLocation = async () => {
  try {
    const params = {
      Key: {
        StoreNumber: '1459-137880',
      },
      TableName: STARBUCKS_LOCATIONS_TABLE_NAME,
    };

    const result = await ddbDocClient.send(new GetCommand(params));
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

logSingleLocation();
