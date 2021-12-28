import { CreateTableCommand } from '@aws-sdk/client-dynamodb';

import ddClient from '../../client/ddbClient';
import { STARBUCKS_LOCATIONS_TABLE_NAME } from '../../utils/constants';

// dynamodb JS datatypes - https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
// set the parameters - https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_CreateTable.html

/**
 * This table needs to handle five main access patterns:
 * 1. Retrieve a single store by its Store Number;
 * 2. Gather all stores in a particular country;
 * 3. Gather all stores in a particular state or province;
 * 4. Gather all stores in a particular city; and
 * 5. Gather all stores in a particular zip code.
 *
 * !!! Instead of creating 4 new GSI to handle #2-#5, we can leverage the hierarchical nature of the location data to answer all four "gather" queries using a single global secondary index.
 * The hierarchical structure of the data is important here. Stores in the same State are in the same Country, stores in the same City are in the same State, and stores in the same Postcode are in the same City.
 * Because of this hierarchical structure, we can use our computed SORT key plus the begins_with() function to find all stores at a particular level.
 */

/**
 * This table only defines neccessary attributes
 * When importing data, we will be adding additional attributes dynamically, which DynamoDB supports
 */
const params = {
  AttributeDefinitions: [
    {
      AttributeName: 'Country',
      AttributeType: 'S',
    },
    {
      AttributeName: 'StateCityPostcode', // this is computed/compound (sort key) string separated by pound sign <STATE>#<CITY>#<POSTCODE>
      AttributeType: 'S',
    },
    {
      AttributeName: 'StoreNumber',
      AttributeType: 'S',
    },
  ],
  KeySchema: [
    {
      AttributeName: 'StoreNumber',
      KeyType: 'HASH', // primary partition key - used to distribute items across shards
    },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'StoreLocationIndex', // index to partition by Country and then by StateCityPostcode
      KeySchema: [
        {
          AttributeName: 'Country',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'StateCityPostcode', // computed sort (range) key
          KeyType: 'RANGE',
        },
      ],
      Projection: {
        ProjectionType: 'ALL',
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  TableName: STARBUCKS_LOCATIONS_TABLE_NAME,
};

const run = async () => {
  try {
    const data = await ddClient.send(new CreateTableCommand(params));
    console.log('Table Created', data);
    return data;
  } catch (err) {
    console.log('Error', err);
  }
};

run();
