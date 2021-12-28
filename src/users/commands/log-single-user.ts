import { GetCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { USERS_TABLE_NAME } from '../../utils/constants';

const logSingleUser = async () => {
  try {
    const params = {
      Key: {
        Username: 'daffyduck',
      },
      ProjectionExpression: 'Age, Username', // Use ProjectionExpression option to return only particular elements from an item
      TableName: USERS_TABLE_NAME,
    };

    const result = await ddbDocClient.send(new GetCommand(params));
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

logSingleUser();
