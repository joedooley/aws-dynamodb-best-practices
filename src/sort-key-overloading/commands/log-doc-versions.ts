import { QueryCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { OVERLOAD_SORTKEY_TABLE_NAME } from '../../utils/constants';

const logDocVersions = async () => {
  try {
    const params = {
      KeyConditionExpression:
        'documentId = :documentId AND begins_with(documentInfo, :version)',
      ExpressionAttributeValues: {
        ':documentId': '123',
        ':version': 'v_',
      },
      TableName: OVERLOAD_SORTKEY_TABLE_NAME,
    };

    const result = await ddbDocClient.send(new QueryCommand(params));
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

logDocVersions();
