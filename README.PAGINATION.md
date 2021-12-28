## Pagination

DynamoDB query can return of maximum of 1 MB results.  
You can retrieve the additional records with pagination by specifying the last read item from the previous one (**LastEvaluatedKey** property).  
You can also set a limit on how many records you want to retrieve (**Limit** property).

```JS
const params = {
      KeyConditionExpression: 'Id = :invoiceId',
      ExpressionAttributeValues: {
        ':invoiceId': 'I#1420',
      },
      TableName: [My_TABLENAME],
      LIMIT: 1,
      ExclusiveStartKey: [LastEvaluatedKey]
    };
```

### Javascript v3

In AWS SDK for JavaScript v3 we’ve improved pagination using async generator functions, which are similar to generator functions, with some differences.
Refer to: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html
