import { QueryCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { ADJACENCY_INVOICEBILLS_TABLE_NAME } from '../../utils/constants';

/**
 * Since we are not supplying a sort key, then we must use QueryCommand rather than GetCommand
 */
const logInvoiceDetails = async () => {
  try {
    const params = {
      KeyConditionExpression: 'PK = :invoiceId',
      ExpressionAttributeValues: {
        ':invoiceId': 'I#1420',
      },
      TableName: ADJACENCY_INVOICEBILLS_TABLE_NAME,
    };

    const result = await ddbDocClient.send(new QueryCommand(params));
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

logInvoiceDetails();
