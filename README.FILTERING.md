## DynamoDB Table Design

When designing your table in DynamoDB, you should think hard about how to segment your data (parition key) into manageable chunks, each of which is sufficient to satisfy your query. This is how DynamoDB scales as these chunks can be spread around different machines.

The value used to segment your data is the “partition key”, and this partition key must be provided in any Query operation to DynamoDB. The requested partition key must be an exact match, as it directs DynamoDB to the exact node where our Query should be performed.

---

## DynamoDB Filter Expressions

Filter expressions in DynamoDB do not work as you think they would (coming from a SQL world)

> Filter Expression can only be used on non-primary key attributes

Filter - order of operations for a SCAN/QUERY

1. Read item from table

2. If FilterExpression, remove items that don't match

3. Return items

> However, the key point to understand is that the Query and Scan operations will return a maximum of 1MB of data, and this limit is applied in step 1, before the filter expression is applied.

> Logical operators (>, <, begins_with, etc.) are the same for key conditions and filter expressions, except you cannot use **contains** as a key condition.

---

## How to Properly Query Filter Data in DynamoDB

> You must use your **table design** to filter your data

1. Partition key
2. Sparse index (secondary index)

### Query with a Partition Key

This is the most common method of filtering data. The partition key is used to separate your items into collections, and a single collection is stored together on a single node in DynamoDB.

**The partition key query can only be equals to (=).** Thus, if you want a compound primary key, then add a sort key so you can use other operators than strict equality.

```
const results = await client.query({
  TableName: 'MusicTable',
  KeyConditionExpression: 'PK = :pk',
  ExpressionAttributeValues: {
    ':pk': 'ALBUM#PAUL MCCARTNEY#FLAMING PIE'
  }
})
```

### Query with a Sparse Index

Secondary indexes are a way to have DynamoDB replicate the data in your table into a new structure using a different primary key schema. This makes it easy to support additional access patterns.

> DynamoDB will only include an item from your main table into your secondary index if the item has **both** key attributes (primary + sort). This is where you notion of sparse indexes comes in — you can use secondary indexes as a way to provide a global filter on your table through the presence of certain attributes on your items.

```
const results = await client.query({
  TableName: 'MusicTable',
  IndexName: 'PlatinumSongsByLabel',  //specify the index name
  KeyConditionExpression: 'PK = :pk',
  ExpressionAttributeValues: {
    ':pk': 'Capitol'
  }
})
```

---

### Querying Sort keys by KeyConditionExpression

The following operators are available for querying sort keys (KeyConditionExpression):

> https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.OperatorsAndFunctions.html

- =
- <
- \>
- <=
- \>=
- between (greater than or equal to the first value, and less than or equal to the second value)
- begins_with
- ~~contains~~ (only available for filter expression)
- ~~not_contains~~ (only available for filter expression)
- ~~in~~ (only available for filter expression) (a IN (b, c, d) — true if a is equal to any value in the list — for example, any of b, c or d. The list can contain up to 100 values, separated by commas)

---

### When Filter Expressions Should Be Used

The three examples below are times where you might find filter expressions useful:

1. Reducing response payload size

- The first reason you may want to use filter expressions is to reduce the size of the response payload from DynamoDB. DynamoDB can return up to 1MB per request. This is a lot of data to transfer over the wire. If you know you’ll be discarding a large portion of it once it hits your application, it can make sense to do the filtering server-side, on DynamoDB, rather than in your client.

2. Easier application filtering

- A second reason to use filter expressions is to simplify the logic in your application. If you’re immediately going to filter a bunch of items from your result, you may prefer to do it with a filter expression rather than in your application code.

```
const results = await client.query({
  TableName: 'MusicTable',
  KeyConditionExpression: 'PK = :pk',
  ExpressionAttributeValues: {
    ':pk': 'ALBUM#PAUL MCCARTNEY#FLAMING PIE'
  }
})

// filter on the client side
const filteredResults = results.Items.filter(item => item.Sales >= 500000)
```

OR, you could use a filter expression to remove the need to do any client-side filtering:

```
const results = await client.query({
  TableName: 'MusicTable',
  KeyConditionExpression: 'PK = :pk',
  FilterExpression: 'Sales >= :threshold', // filter on the server side
  ExpressionAttributeValues: {
    ':pk': 'ALBUM#PAUL MCCARTNEY#FLAMING PIE',
    ':threshold': 500000
  }
})
```

3. Better validation around time-to-live (TTL) expiry.

- The last example of filter expressions is a popular use — you can use filter expressions to provide better validation around TTL expiry.
- The DynamoDB docs only state that DynamoDB will typically delete items within 48 hours of expiration. As such, there’s a chance our application may read an expired session from the table for 48 hours (or more!) after the session should have expired.

```
// Find the current timestamp.
const time = Date.now() / 1000

client.query({
  TableName: 'SessionStore',
  KeyConditionExpression: 'SessionId = :session',
  FilterExpression: 'ExpiresAt >= :currentTime,
  ExpressionAttributeValues: {
    ':session': 'd96d4fa6-2a20-48e0-a6cf-676397597a81'
    ':currentTime': time
  }
})
```

---

### Filter Expression Result - Count vs ScannedCount

```
{
    "Count": 1,
    "Items": [
        {
            "OrderId": {
                "S": "20170609-25875"
            },
            "Username": {
                "S": "daffyduck"
            },
            "Amount": {
                "N": "116.86"
            }
        }
    ],
    "ScannedCount": 4,
    "ConsumedCapacity": null
}
```

> Look at the difference between "ScannedCount" and "Count". ScannedCount refers to the number of Items retrieved in Step 1 (Order of Operations). Count refers to the number of Items returned to the client.  
> **We consumed read capacity for those 4 scanned units, but only 1 was returned to us.**
