import * as fs from 'fs';
import * as path from 'path';

import { PutCommand } from '@aws-sdk/lib-dynamodb';

import ddbDocClient from '../../client/ddbDocClient';
import { OVERLOAD_SORTKEY_TABLE_NAME } from '../../utils/constants';

const run = () => {
  console.log('Loading movie data into DynamoDB');

  const documentData = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, './data.json'), 'utf8')
  );

  documentData.forEach(async (document) => {
    let params = {
      TableName: OVERLOAD_SORTKEY_TABLE_NAME,
      Item: {},
    };

    switch (document.documentInfo) {
      case 'metadata': {
        params = {
          TableName: OVERLOAD_SORTKEY_TABLE_NAME,
          Item: {
            documentId: document.documentId,
            documentInfo: document.documentInfo,
            keyValue: document.keyValue,
          },
        };
        break;
      }
      case 'permissions': {
        params = {
          TableName: OVERLOAD_SORTKEY_TABLE_NAME,
          Item: {
            documentId: document.documentId,
            documentInfo: document.documentInfo,
            permissions: document.permissions,
          },
        };
        break;
      }
      case 'parentFolderInfo': {
        params = {
          TableName: OVERLOAD_SORTKEY_TABLE_NAME,
          Item: {
            documentId: document.documentId,
            documentInfo: document.documentInfo,
            folderPath: document.folderPath,
            parentFolderId: document.parentFolderId,
          },
        };
        break;
      }
      default: {
        // versions
        params = {
          TableName: OVERLOAD_SORTKEY_TABLE_NAME,
          Item: {
            documentId: document.documentId,
            documentInfo: document.documentInfo,
            storageLocation: document.storageLocation,
          },
        };
      }
    }

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
