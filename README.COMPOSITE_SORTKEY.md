## Composite Sort Key

> If your query criteria needs to use more than two attributes, so you will create a compound-key structure that allows you to query with more than two attributes.

Example:

County#State#City

This compound-key structure gives you the power to query by:

- Country
- Country + State
- Country + State + City

---

### Example Table

| PK          | SK                             | TYPE | COUNTRY | CITY          | STORE DATE         | Sales |
| ----------- | ------------------------------ | ---- | ------- | ------------- | ------------------ | ----- |
| SALE#USA    | SAN_FRANCISCO#00235#2020-09-22 | SALE | USA     | San Francisco | 00235 2020-09-22   | …     |
| SALE#USA    | LOS_ANGELES#00316#2020-10-12   | SALE | USA     | Los Angeles   | 00316 2020-10-12 … |
| SALE#USA    | SEATTLE#00110#2020-08-04       | SALE | USA     | Seattle       | 00110 2020-08-04 … |
| SALE#FRANCE | PARIS#00512#2020-15-15         | SALE | FRANCE  | Paris         | 00512 2020-15-15 … |

You can get data for:

- Country (PK = SALE#USA)
- City (PK = SALE#USA, SK = begins_with("SAN_FRANCISCO"))
- Store (PK = SALE#USA, SK = begins_with("SAN_FRANCISCO#00235"))
- By year / month / day for store (PK = SALE#USA, SK = begins_with("SAN_FRANCISCO#00235#2020-09"))

> If that particular combination does not fit your case, you can easily add a new hierarchy/composite sort key in the new GSI. Pay attention so that too many items do not share the same partition key.
