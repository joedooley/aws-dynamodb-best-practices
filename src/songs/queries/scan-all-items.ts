import { ScanCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { SONGS_TABLE_NAME } from '../../utils/constants';

const scanAllItems = async () => {
  try {
    const params = {
      TableName: SONGS_TABLE_NAME,
    };

    const result = await ddbDocClient.send(new ScanCommand(params));
    console.log(JSON.stringify(result));
  } catch (error) {
    console.error(error);
  }
};

scanAllItems();
