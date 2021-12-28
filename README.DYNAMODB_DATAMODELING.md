## DynamoDB Data Modeling

> There are many options on how to design a data model for DynamoDB. Different developers will end up with a different result for the same task. That is contrary to modeling for RDBMS databases, where in most cases, they will end up with very similar results.

Principals of Data Modeling

- Single table design

  - The downside of a single table design is that data looks confusing and hard to read without proper documentation.
  - Recommendation: Name keys and secondary indexes with uniform names, like PK (partition key), SK (sort key), GS1PK (first global secondary index partition key), GS1SK (first global secondary index sort key).
  - Identify the type of the item by prefixing keys with type, like PS: USER#123 (USER = type, 123 = id).

- For timestamp keys, consider using a KSUID (K-Sortable Unique Identifier) rather than a commonly used UUID

  - KSUID is a 27 characters long string that combines a timestamp and an additional random key.
  - The timestamp part allows for **chronological sorting**.
  - An additional key is just to make sure the same key is deduplicated in some rare scenario.

- Draw the ER diagram as you usually do

- Get all access patterns before starting data modeling

  - This is extremely important. Failure to understand all your access patterns may lead to an unscalable table or worse, you will need to re-create your table and re-import all the existing data

- Denormalization/Duplication

  - In contrary to RDBMS databases, you are storing data in a way that you can read it as quickly as possible. Duplicating data is standard practice.
    DynamoDB is designed to hold a large amount of data and nowadays, storage is cheap.
  - If the duplicated data is immutable (does not change), there is no problem. But if the data can change, you have to take care of consistency by updating each record when data changes.

- Avoid hot partition

  - Hot partition occurs when you have a lot of requests that are targeted to only one partition. In 2018, AWS introduced adaptive capacity, which reduced the problem, but it still very much exists.
  - You can use caching (Redix/DAX) was an escape hatch

- Do not use scan on large datasets

  - Scan means reading all the data from the table. It can be used when migrating a data model or when you actually have to process all the records.

- Do not use a filter on large datasets

  - A filter is applied after the data is read from the database, so you are throwing away all the work you just did (1MB limit). From this dataset, DynamoDB removes the date that does not fit the filter. That means your query can return zero records, although there would be records you searched for in the database.

- Prefer eventually consistent reads

  - That is the default and the only option for reading from GSI. To avoid the need for strong consistency reads, do not read data immediately after you wrote it. You already have it, so you should not do that anyway, and now you have another reason not to do it.

- The data model is hard to change

  - This is contrary to intuition because DynamoDB does not enforce data schema. It is simple to add some attributes but very hard to change relations to adapt to new access patterns. In most cases, you have to scan the whole database and restructure each record.

- Prepare for data model change

  - Because you cannot avoid all the data model changes, prepare a system to reformat the data structure to adopt a new date model. That way, you are not constrained too much when the new requirements come. The most common approach is to scan all elements and write them in a new structure. A more straightforward solution is configuring streams on the old table that writes to a new one using a lambda.

- Avoid transactions

  - Transactions perform more reads and writes than normal operations. They are more limiting than in RDBMS databases, but you do not need them that much. Do not use transactions to maintain a normalized data model.

- Use TTL to schedule the deletion of items
  - This timestamp must be set in the Unix epoch time format. The **downside of this feature is that it guarantees deletion within 48 hours**.
  - If you want to be sure that you only get data that has not passed TTL, you can combine with filter expression that will remove items that have passed the TTL timestamp.
