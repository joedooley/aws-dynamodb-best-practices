import * as fs from 'fs';
import * as path from 'path';

import { PutCommand } from '@aws-sdk/lib-dynamodb';
import csv from 'csv-parser';

import ddbDocClient from '../../client/ddbDocClient';
import { ADJACENCY_INVOICEBILLS_TABLE_NAME } from '../../utils/constants';

const run = () => {
  console.log('Loading order data into DynamoDB');

  // note: this may exceed your WCU - but the goal is to just get some data in the table... don't need it all imported
  fs.createReadStream(path.resolve(__dirname, './invoice-data.csv'))
    .pipe(csv())
    .on('data', async (row) => {
      // *we take a single record in the CSV and create multiple dynamodb items
      // NOTE: there is an issue with the CSV where multiple customers share the same customerId

      //  invoice - main data
      const invoice_params = {
        TableName: ADJACENCY_INVOICEBILLS_TABLE_NAME,
        Item: {
          PK: row.InvoiceId,
          SK: 'root',
          InvoiceDate: row.InvoiceDate,
          InvoiceBalance: row.InvoiceBalance,
          InvoiceStatus: row.InvoiceStatus,
          InvoiceDueDate: row.InvoiceDueDate,
        },
      };

      try {
        const data = await ddbDocClient.send(new PutCommand(invoice_params));
        console.log(data);
      } catch (err) {
        console.error(err);
      }

      // #ADJACENCY LIST - map from invoice side to customer/bill

      //  invoice customer relationship
      const invoice_customer_relationship_params = {
        TableName: ADJACENCY_INVOICEBILLS_TABLE_NAME,
        Item: {
          PK: row.InvoiceId,
          SK: row.CustomerId,
        },
      };

      try {
        const data = await ddbDocClient.send(
          new PutCommand(invoice_customer_relationship_params)
        );
        console.log(data);
      } catch (err) {
        console.error(err);
      }

      //  invoice bill relationship
      const invoice_bill_relationship_params = {
        TableName: ADJACENCY_INVOICEBILLS_TABLE_NAME,
        Item: {
          PK: row.InvoiceId,
          SK: row.BillId,
          BillAmount: row.BillAmount,
          BillBalance: row.BillBalance,
        },
      };

      try {
        const data = await ddbDocClient.send(
          new PutCommand(invoice_bill_relationship_params)
        );
        console.log(data);
      } catch (err) {
        console.error(err);
      }

      // #ADJACENCY LIST - map from customer/bill side to invoice

      // customer - main data
      const customer_params = {
        TableName: ADJACENCY_INVOICEBILLS_TABLE_NAME,
        Item: {
          PK: row.CustomerId,
          SK: row.InvoiceId,
          CustomerName: row.CustomerName,
          State: row.State,
        },
      };

      try {
        const data = await ddbDocClient.send(new PutCommand(customer_params));
        console.log(data);
      } catch (err) {
        console.error(err);
      }

      // bill - main data
      const bill_params = {
        TableName: ADJACENCY_INVOICEBILLS_TABLE_NAME,
        Item: {
          PK: row.BillId,
          SK: row.InvoiceId,
          BillDueDate: row.BillDueDate,
          BillAmount: row.BillAmount,
        },
      };

      try {
        const data = await ddbDocClient.send(new PutCommand(bill_params));
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
