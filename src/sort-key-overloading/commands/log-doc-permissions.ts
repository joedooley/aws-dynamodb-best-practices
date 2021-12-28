import { GetCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { OVERLOAD_SORTKEY_TABLE_NAME } from '../../utils/constants';

/**
 * The sort key (documentInfo) is overloaded with a value that contains the context of the data
 * In this example, we are grabbing the permissions for documentId 123
 */
const logDocPermissions = async () => {
  try {
    const params = {
      Key: {
        documentId: '123',
        documentInfo: 'permissions',
      },
      TableName: OVERLOAD_SORTKEY_TABLE_NAME,
    };

    const result = await ddbDocClient.send(new GetCommand(params));
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

logDocPermissions();
