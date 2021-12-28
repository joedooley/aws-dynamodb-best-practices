import { QueryCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { ADJACENCY_INVOICEBILLS_TABLE_NAME } from '../../utils/constants';

/**
 * We are using the GSI to query by BillId
 */
const logBillInvoices = async () => {
  try {
    const params = {
      KeyConditionExpression: 'SK = :billId',
      ExpressionAttributeValues: {
        ':billId': 'B#3392',
      },
      TableName: ADJACENCY_INVOICEBILLS_TABLE_NAME,
      IndexName: 'RelatedIdIndex',
    };

    const result = await ddbDocClient.send(new QueryCommand(params));
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

logBillInvoices();
