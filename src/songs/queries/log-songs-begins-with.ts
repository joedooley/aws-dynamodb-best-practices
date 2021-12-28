import { QueryCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { SONGS_TABLE_NAME } from '../../utils/constants';

const logArtistSongsStartingWith = async () => {
  try {
    const params = {
      KeyConditionExpression: 'artist = :artist AND begins_with(song, :song)',
      ExpressionAttributeValues: {
        ':artist': 'Arturus Ardvarkian',
        ':song': 'C',
      },
      TableName: SONGS_TABLE_NAME,
    };

    const result = await ddbDocClient.send(new QueryCommand(params));
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

logArtistSongsStartingWith();
