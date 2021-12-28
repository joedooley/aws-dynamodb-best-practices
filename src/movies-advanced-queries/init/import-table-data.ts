import * as fs from 'fs';
import * as path from 'path';

import { PutCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { MOVIES_TABLE_NAME } from '../../utils/constants';

const run = () => {
  console.log('Loading movie data into DynamoDB');

  const movieData = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, './moviedata.json'), 'utf8')
  );
  movieData.forEach(async (movie) => {
    const params = {
      TableName: MOVIES_TABLE_NAME,
      Item: {
        Year: movie.year,
        Title: movie.title,
        Info: movie.info,
      },
    };

    try {
      const data = await ddbDocClient.send(new PutCommand(params));
      console.log(data);

      return data;
    } catch (err) {
      console.error(err);
    }
  });
};

run();
