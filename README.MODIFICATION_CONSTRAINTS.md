## Patterns Based on Modification Constraints

Two DynamoDB features are essential:

- Condition expressions

  - When manipulating data in an Amazon DynamoDB table, you can specify a condition expression to determine which items should be modified. This is an extremely powerful feature.

- Set collection type
  - DynamoDB can, amongst many attribute types, hold lists or sets. They are similar, but sets values are unique. The useful feature of the set is also when removing the item, you can specify the value that you want to remove. In lists, you have to specify the index of the element, which you might not know. Using sets in DocumentClient, the most commonly used JavaScript library, is tricky. Arrays are by default converted to lists.

---

### Differentiation of Insert and Upate

Put method does not differentiate between insert and replacing the item.  
Sometimes you want to restrict to inserts only, which you can do with the **attribute_not_exists() **condition.

```js
const putParams = {
  TableName: 'data',
  Item: {
    PK: 'ACTION#2341',
    SK: 'ACTION#2341',
    ExecutedAt: new Date().toISOString(),
  },
  ConditionExpression: 'attribute_not_exists(#PK)', //make this put operation behave like an INSERT
  ExpressionAttributeNames: {
    '#PK': 'PK',
  },
};

// dynamodbClient.put(...)
```

---

### Condiiton Expression on the Same Item

```js
//Suppose your item
/*Item: {
    PK: "DOCUMENT#JKK",
    SK: "DOCUMENT#JKK",
    TYPE: "DOCUMENT",
    editors: ["John", "Michael"],
    content: "Some content"
  }*/

const updateParams = {
  TableName: 'data',
  Key: {
    PK: 'DOCUMENT#JKK',
    SK: 'DOCUMENT#JKK',
  },
  ConditionExpression: 'contains(#editors, :user)', //only allow update if user is one of the editors
  UpdateExpression: 'SET #content = :newContent',
  ExpressionAttributeNames: {
    '#content': 'content',
    '#editors': 'editors',
  },
  ExpressionAttributeValues: {
    ':newContent': 'New content',
    ':user': 'John',
  },
  ReturnValues: 'ALL_NEW',
};
```

---

### Condition Expression across Multiple Items

The list of editors can be written on another item. The principal is the same, but you have to use a transaction.

| PK           | SK (TYPE) | Document | Editors             |
| ------------ | --------- | -------- | ------------------- |
| DOCUMENT#JKK | DOCUMENT  | …        |                     |
| DOCUMENT#MKG | DOCUMENT  | …        |                     |
| EDITORS      | EDITORS   |          | ["John", "Michael"] |

```js
const transactionWriteParams = {
  TransactItems: [
    {
      ConditionCheck: {
        Key: {
          PK: 'EDITORS',
          SK: 'EDITORS',
        },
        TableName: 'data',
        ConditionExpression: 'contains(#editors, :user)',
        ExpressionAttributeNames: {
          '#editors': 'editors',
        },
        ExpressionAttributeValues: {
          ':user': 'John',
        },
      },
    },
    {
      Update: {
        TableName: 'data',
        Key: {
          PK: 'DOCUMENT#JKK',
          SK: 'DOCUMENT',
        },
        UpdateExpression: 'SET #content = :newContent',
        ExpressionAttributeNames: {
          '#content': 'content',
        },
        ExpressionAttributeValues: {
          ':newContent': 'New content',
        },
      },
    },
  ],
};
```

---

### Optimistic Locking

The principal of optimistic locking is that you update the item only if it was not changed since you read it from the database.  
This is simplify achieved with a special attribute that holds the version number, which we increase when we execute an update. With the condition, we guarantee that the item was not updated.

```js
const currentVersion = 3;

const updateParams = {
  TableName: 'data',
  Key: {
    PK: 'ITEM#2345',
    SK: 'ITEM#2345',
  },
  UpdateExpression: 'set #data = :newData, #version = :newVersion',
  ConditionExpression: '#version = :expectedVersion', //only update if version on the item is 3
  ExpressionAttributeNames: {
    '#data': 'data',
    '#version': 'version',
  },
  ExpressionAttributeValues: {
    ':newData': 'New data',
    ':newVersion': currentVersion + 1, //increment the version
    ':expectedVersion': currentVersion,
  },
};
```
