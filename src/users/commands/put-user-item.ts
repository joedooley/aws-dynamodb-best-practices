import { PutCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { USERS_TABLE_NAME } from '../../utils/constants';

/**
 * With the PutItem call, you provide an entire Item to be placed into your DynamoDB table.
 * This action will create a new Item if no Item with the given primary key exists, or it will overwrite an existing Item if an Item with that primary key already exists.
 */
const putUserItem = async () => {
  try {
    const params = {
      TableName: USERS_TABLE_NAME,
      Item: {
        Username: 'alexdebrie',
      },
    };

    let result = await ddbDocClient.send(new PutCommand(params));
    console.log(result);

    // You can add additional attributes that aren't part of the table's original schema!
    // We've also added Name and Age attributes, each with the proper attribute types.
    // Unlike a relational database, we didn't need to define these additional attributes up front. We can add them freely as needed.
    // DynamoDB's flexibility can be a blessing and a curse. The flexibility allows for a more dynamic data model that may fit your requirements.
    // However, it won't provide the useful guardrails that a relational database includes to assist with data integrity.
    const user2Params = {
      TableName: USERS_TABLE_NAME,
      Item: {
        Username: 'daffyduck',
        Name: 'Daffy Duck', // new attribute not on the table
        Age: 81, // new attribute not on the table
      },
    };

    result = await ddbDocClient.send(new PutCommand(user2Params));
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

putUserItem();
