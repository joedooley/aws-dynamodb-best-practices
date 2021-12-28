## Adjacency Lists

> When different entities of an application have a many-to-many relationship between them, it is easier to model the relationship as an adjacency list.

In this model, all top-level entities (synonymous with nodes in the graph model) are represented as the partition key.  
Any relationship with other entities (edges in a graph) are represented as an item within the partition by setting the value of the sort key to the target entity ID (target node).

### Gotcha

**This pattern works best when data is immutable.** In case data is not immutable, and there is a lot of related data that changes frequently, the pattern might not be sustainable because, with every update, you have to update too many records. In that case, try to include only immutable data (key, username, email) in records that store relationship.

**If you need more data after reading relationship records, you have to execute additional queries to retrieve detailed data.**

---

### One to Many Relationship - Invoice and Bills Example

In this scenario, a customer can have multiple invoices, so there is a 1-to-many relationship between a customer ID and an invoice ID.  
An invoice contains many bills, and a bill can be broken up and associated with multiple invoices.  
So there is a many-to-many relationship between invoice ID and bill ID. The partition key attribute is either an invoice ID, bill ID, or customer ID.

| Attribute Name (Type) | Special Attribute?            | Attribute Use Case                                                               | Sample Attribute Value    |
| --------------------- | ----------------------------- | -------------------------------------------------------------------------------- | ------------------------- |
| PK (STRING)           | Partition key                 | Holds the ID of the entity, either a bill, invoice, or customer (multiple types) | B#3392 or I#506 or C#1317 |
| SK (STRING)           | Sort key, GSI_1 partition key | Holds the related ID: either a bill, invoice, or customer                        | I#1721 or C#506 or I#1317 |

This design model supports the following access patterns:

- Using the invoice ID, retrieve the top-level invoice details, customer, and associated bill details.
- Retrieve all invoice IDs for a customer ID.
- Using the bill ID, retrieve the top-level bill details and the associated invoice details.

---

### Many to Many Relationship using Materialzied Graph Pattern

> GSI TIP: The GSI PK/SK does not need to use existing attributes from the parent table.
> **You can define your own GSI1PK and GSI1SK that has it's own unique/computed data to create new access patterns**

Materialized graph pattern is not so commonly used.  
It is the evolution of the adjacency list to a more complex pattern.  
You do not store just relationships but also define the type of relationship and hierarchy of the data.

| PK          | SK                            | TYPE    | Subject | Name    | GSI1PK          | GSI1SK              |
| ----------- | ----------------------------- | ------- | ------- | ------- | --------------- | ------------------- |
| STUDENT#TOM | STUDENT#TOM                   | STUDENT |         | Tom     | STUDENT#TOM     | STUDENT#TOM         |
| STUDENT#TOM | TEACHER#SIMON#CLASS#MATH      | CLASS   | Math    | Simon   | TEACHER#SIMON   | CLASS#MATH          |
| STUDENT#TOM | TEACHER#MICHAEL#CLASS#PHYSICS | CLASS   | Physics | Michael | TEACHER#MICHAEL | CLASS#PHYSICS       |
| STUDENT#TOM | HOME#USA#CA#LOS_ANGELES       | HOME    |         |         | COUNTRY#USA     | HOME#CA#LOS_ANGELES |

You store connections and type of connection between nodes.  
Then you play with sort keys and GSI to see the other part of the relationship and achieve other access patterns.
