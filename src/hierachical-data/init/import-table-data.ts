import * as fs from 'fs';
import * as path from 'path';

import { PutCommand } from '@aws-sdk/lib-dynamodb';
import csv from 'csv-parser';

import ddbDocClient from '../../client/ddbDocClient';
import { STARBUCKS_LOCATIONS_TABLE_NAME } from '../../utils/constants';

// https://www.kaggle.com/starbucks/store-locations

const run = () => {
  console.log('Loading starbucks locations data into DynamoDB');

  // note: this may exceed your WCU - but the goal is to just get some data in the table... don't need it all imported
  fs.createReadStream(path.resolve(__dirname, './directory.csv'))
    .pipe(csv())
    .on('data', async (row) => {
      // here we are combining values from multiple columns into a single value to make queries faster
      const computed_range_key =
        `${row['State/Province']}#${row.City}#${row.Postcode}`.toUpperCase();

      const params = {
        TableName: STARBUCKS_LOCATIONS_TABLE_NAME,
        Item: {
          Country: row.Country,
          State: row['State/Province'],
          City: row.City,
          Postcode: row.Postcode,
          StateCityPostcode: computed_range_key,
          StoreNumber: row['Store Number'],
          StoreName: row['Store Name'],
          StreetAddress: row['Street Address'],
          Latitude: row.Latitude,
          Longitude: row.Longitude,
          PhoneNumber: row['Phone Number'],
        },
      };

      try {
        const data = await ddbDocClient.send(new PutCommand(params));
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
};

run();
