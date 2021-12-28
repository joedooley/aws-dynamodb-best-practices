import { UpdateCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { USERS_TABLE_NAME } from '../../utils/constants';

/**
 * When using the update expression, you must include one of four update clauses. These clauses are:
 *
 * SET: Used to add an attribute to an Item or modify an existing attribute;
 * REMOVE: Used to delete attributes from an Item.
 * ADD: Used to increment/decrement a Number or insert elements into a Set.
 * DELETE: Used to remove items from a Set.
 */
const updateSingleUser = async () => {
  try {
    const params = {
      Key: {
        Username: 'daffyduck',
      },
      UpdateExpression: 'SET #dob = :dob', // The most common update clause is "SET", which is used to add an attribute to an Item if the attribute does not exist or to overwrite the existing attribute value if it does exist.
      ExpressionAttributeNames: {
        '#dob': 'DateOfBirth',
      },
      ExpressionAttributeValues: {
        ':dob': '1937-04-17',
      },
      TableName: USERS_TABLE_NAME,
    };

    const result = await ddbDocClient.send(new UpdateCommand(params));
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

updateSingleUser();
