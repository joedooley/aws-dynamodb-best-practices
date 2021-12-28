import * as fs from 'fs';
import * as path from 'path';

import { PutItemCommand } from '@aws-sdk/client-dynamodb';

import ddClient from '../../client/ddbClient';
import { SONGS_TABLE_NAME } from '../../utils/constants';

// Note: This is not using `import ddbDocClient from '../../client/ddbDocClient'` which would allow us not to have to specify data types
const run = () => {
  console.log('Loading song data into DynamoDB');

  const songData = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, './data.json'), 'utf8')
  );
  songData.forEach(async (song) => {
    const params = {
      TableName: SONGS_TABLE_NAME,
      Item: {
        artist: { S: song.artist },
        song: { S: song.song },
        id: { S: song.id },
        priceUsdCents: { N: song.priceUsdCents.toString() }, // dynamodb expects a string and will convert to a number
        publisher: { S: song.publisher },
      },
    };

    try {
      const data = await ddClient.send(new PutItemCommand(params));
      console.log(data);

      return data;
    } catch (err) {
      console.error(err);
    }
  });
};

run();
