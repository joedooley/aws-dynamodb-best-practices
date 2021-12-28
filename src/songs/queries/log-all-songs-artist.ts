import { QueryCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { SONGS_TABLE_NAME } from '../../utils/constants';

const logSongsByArtist = async () => {
  try {
    const params = {
      KeyConditionExpression: 'artist = :artist',
      ExpressionAttributeValues: {
        ':artist': 'Arturus Ardvarkian',
      },
      TableName: SONGS_TABLE_NAME,
    };

    const result = await ddbDocClient.send(new QueryCommand(params));
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

logSongsByArtist();
