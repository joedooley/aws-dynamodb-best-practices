## Starting Points

https://www.freecodecamp.org/news/ultimate-dynamodb-2020-cheatsheet/

https://www.serverlesslife.com/DynamoDB_Design_Patterns_for_Single_Table_Design.html

https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html

https://www.fernandomc.com/posts/eight-examples-of-fetching-data-from-dynamodb-with-node/

https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/dynamodb

https://stackoverflow.com/questions/27329461/what-is-hash-and-range-primary-key

https://www.dynamodbguide.com/
https://www.jeremydaly.com/important-lessons-from-the-dynamodb-book/

https://amazon-dynamodb-labs.com/hands-on-labs.html

https://www.bmc.com/blogs/dynamodb-advanced-queries/

https://aws.amazon.com/blogs/database/using-sort-keys-to-organize-data-in-amazon-dynamodb/

---

## Nodejs Tricks

The AWS Node.js SDK is hard to work with.

Check out:

- Dynoexpr

  - https://github.com/tuplo/dynoexpr

- DynamoDB Toolbox
  - https://github.com/jeremydaly/dynamodb-toolbox

---

## DynamoDB API Reference

https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html

DynamoDB Reserved Words: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html

---

## DynamoDB vs RelationalSQL

> Designing DynamoDB data models goes against established principles of designing RDBMS databases.

https://www.alexdebrie.com/posts/dynamodb-filter-expressions/

For many, it’s a struggle to unlearn the concepts of a relational database and learn the unique structure of a DynamoDB single table design. Primary keys, secondary indexes, and DynamoDB streams are all new, powerful concepts for people to learn.

If you’re coming from a relational world, you’ve been spoiled. You’ve had this wonderfully expressive syntax, SQL, that allows you to add any number of filter conditions.  
With this flexible query language, relational data modeling is more concerned about structuring your data correctly. Once you’ve properly normalized your data, you can use SQL to answer any question you want.

DynamoDB is not like that. With DynamoDB, you need to plan your access patterns up front, then model your data to fit your access patterns.  
This is because **DynamoDB won’t let you write a query that won’t scale**. As such, you will use your primary keys and secondary indexes to give you the filtering capabilities your application needs.

https://www.alexdebrie.com/posts/dynamodb-no-bad-queries/

### Because of limited functionality, you should think twice if DynamoDB is the right choice for you if:

- Your database is not enormous or can be sharded,
- It requires a complex data mode,
- It requires future reach ad hoc query language (SQL)

---

## DynamoDB Keys

**Primary/Partition Key**  
This is a unique value for every item. The value of the partition key is used as input to an internal hash function.  
The output determines the partition (physical location/single node) in which the item will be stored.  
_Used to separate your items into collections_

**Composite Key - Partition + Sort (Range) Key**

> Note: Take note that **data in the sort key of the primary index cannot be changed**.
> If you have data that can change (e.g., customer last visit) and want to take advantage of features of the sort key, you can use them on the secondary index.

Composed of two attributes... the first attribute is the partition key, the second attribute is the sort key.  
Two or more items can have the same parition key, but they must have a different sort key.

All items with the same parition key are stored (physically) together, then sorted according tot he sort key value.  
You get a subset of data by proviing a partition key and a **range** of values for sort key.

Example: CustomerID (partition key) and OrderID (sort key).  
The same CustomerID can have multiple Orders.

---

## DynamoDB Indexes

> Both LSI and GSI are implemented as copying all the data to a new table-like structure.

**Local Secondary Index**

> MUST BE CREATED WHEN YOU CREATE YOUR TABLE

- This is an index with the same parition key as the table but with a **different** sort key.
- Uses RCU/WCU of main table but **does not throttle the main table**.
- Can only be used on tables with composite primary keys.
- **You can choose between eventual and strongly consistent reads**.
- 10GB limit per HASH (partition) key.

> When provisioning a secondary index, you specify which attributes you want to project into the index.

Your options for attribute projections are:

- **KEYS_ONLY**: Your index will include only the keys for the index and the table's underlying partition and sort key values, but no other attributes.

- **ALL**: The full Item is available in the secondary index with all attributes.

- **INCLUDE**: You may choose to name certain attributes that are projected into the secondary index.

---

**Global Secondary Index (GSI)**

> CAN CREATE A NEW GSI ANYTIME

> GSI is a Sparse Index by default... Only items that contain both the parition and sort key appear in the index
> https://www.alexdebrie.com/posts/dynamodb-filter-expressions/#sparse-index

> Tip: Swap partition and sort key in GSI so you can query the opposite direction of the relationship.

- This is an index with a **different** partition and sort key from those on the table.
- Secondary indexes are a way to have DynamoDB replicate the data in your table into a new structure using a different primary key schema.
- You must carefully assign RCU/WCU for the index. **May throttle the main table.**
  - If you underprovision a global secondary index, it might start to apply back pressure on your tables in the form of throttles. Back pressure is problematic because it will cause all write requests to the base table to be rejected until the buffer between the base table and GSI has enough space for new data.
- Can be used on any table. GSI can be create on tables with simple or composite primary keys.
- **GSI does not support strongly consistent reads**.
- No partition key size limits.

> TIP: The GSI PK/SK does not need to use existing attributes from the parent table.
> **You can define your own GSI1PK and GSI1SK that has it's own unique/computed data to create new access patterns**

--

**Sparse Index**

A sparse index is when not every Item contains the attribute you're indexing.  
Only Items with the attribute(s) matching the key schema for your index will be copied into the index, so you may end up with fewer Items in the index than in the underlying table.  
The fewer table attributes you project into the index, the fewer write and read capacity units you consume from the index.

| PK          | STATUS            | CUSTOMER     | SHIP_DATE           | SPARSE_SHIPPED_PK | SPARSE_SHIPPED_SK   |
| ----------- | ----------------- | ------------ | ------------------- | ----------------- | ------------------- |
| ORDER#00001 | AWAITING_PAYMENT  | CUSTOMER#KHJ |
| ORDER#00002 | AWAITING_SHIPMENT | CUSTOMER#JHD |
| ORDER#00003 | SHIPPED           | CUSTOMER#JHD | 2020-10-26T09:39:14 | CUSTOMER#JHD      | 2020-10-26T09:39:14 |

> The sparse index only contains data for shipped orders.

This index allows you to:

- Read all shipped orders (IndexName = SPARSE_SHIPPED)
- Read last 10 shipped orders for a customer (IndexName = SPARSE_SHIPPED, SPARSE_SHIPPED_PK = CUSTOMER#JHD, Limit = 11)
- Read all shipped orders for a customer shipped after X date (IndexName = SPARSE_SHIPPED, SPARSE_SHIPPED_PK = CUSTOMER#JHD, SPARSE_SHIPPED_SK >= 2020-10-01)
