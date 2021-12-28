import { GetCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { SONGS_TABLE_NAME } from '../../utils/constants';

const logSingleItem = async () => {
  try {
    const params = {
      Key: {
        artist: 'Arturus Ardvarkian',
        song: 'Carrot Eton',
      },
      TableName: SONGS_TABLE_NAME,
    };

    const result = await ddbDocClient.send(new GetCommand(params));
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

logSingleItem();
