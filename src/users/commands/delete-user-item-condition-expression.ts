import { DeleteCommand } from '@aws-sdk/lib-dynamodb';

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
const deleteSingleUser = async () => {
  try {
    const params = {
      Key: {
        Username: 'yosemitesam',
      },
      ConditionExpression: 'Age < :a', // specify a condition expression to determine which items should be modified
      ExpressionAttributeValues: {
        ':a': 21,
      },
      TableName: USERS_TABLE_NAME,
    };

    const result = await ddbDocClient.send(new DeleteCommand(params));
    console.log(result);
  } catch (error) {
    console.error(error); // expected: ConditionalCheckFailedException: The conditional request failed
  }
};

deleteSingleUser();
