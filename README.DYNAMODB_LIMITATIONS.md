### DynamoDB Limitations

DynamoDB has many limits that prevent you from making unscalable solutions. Here are the most important ones:
As of 7/15/2021

- Item size: max. **400 KB item**
  - You can get around this by splitting the item up into separate items with same partition key but different sort keys
- Size of the result set for query and scan: max. 1 MB. The limit is applied before filter and projection. You can retrieve all records with subsequent requests.
- Records with the same partition key: max. 10 GB. That includes LSI (but not GSI).
- Partition throughput: 1000 WCU, 3000 RSU
- Transactions: up to 25 unique items or up to 4 MB of data, including conditions.
- Batch write: max. 25 items, max. 16 MB
- Batch get item: max. 100 items, max. 16 MB
- DynamoDB uses **lexicographical sorting**
  - This means that sorting on strings will not work as you may expect
  - An item with **SK = version#10 comes earlier than SK = VERSION#2** — not an intended behaviour.
