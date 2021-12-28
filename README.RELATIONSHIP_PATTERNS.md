## Relationship Patterns

Most patterns for modeling a relationship take advantage of the following principals:

- Collocate related data by having the same partition key and different sort key to separate it.
- Sort key allows searching so you can limit which related data you want to read and how much of them (e.g., first 10 records)
- Swap partition and sort key in GSI so you can query the opposite direction of the relationship.

---

### One to Many Relationship Pattern

See: README.ADJACENCY_LISTS.md

All the related records have the ID of the parent item in the partition key.  
The ID of each item is stored in the sort key.  
For the parent item, it is the same as the partition key.

| PK           | SK           | TYPE     | Customer ID | Order ID | Name  |
| ------------ | ------------ | -------- | ----------- | -------- | ----- |
| CUSTOMER#XYQ | CUSTOMER#XYQ | CUSTOMER | XYQ         |          | Tom   |
| CUSTOMER#XYQ | ORDER#00001  | ORDER    |             | 00001    |       |
| CUSTOMER#XYQ | ORDER#00002  | ORDER    |             | 00002    |       |
| CUSTOMER#VLD | CUSTOMER#VLD | CUSTOMER | VLD         |          | Linda |
| CUSTOMER#VLD | ORDER#00003  | ORDER    |             | 00003    |       |
| CUSTOMER#VLD | ORDER#00004  | ORDER    |             | 00004    |       |

---

### Many to Many Relationship Pattern - Adjacency List (Duplicities for Relationship)

Each entity is stored independently with its own partition key.  
Relationships are stored as an additional item with the partition key's value as one part of the relationship and the sort key as the other part.  
In those additional items, you also duplicate essential data from related items.  
**You invert PK and SK in GSI to access the other side of the relationship.**

---

### Many to Many Relationship Pattern - Materialized Graph Pattern

Materialized graph pattern is not so commonly used.  
It is the evolution of the adjacency list to a more complex pattern.  
You do not store just relationships but also define the type of relationship and hierarchy of the data.
You store connections and type of connection between nodes.  
Then you play with sort keys and GSI to see the other part of the relationship and achieve other access patterns.

| PK          | SK                            | TYPE    | Subject | Name    | GSI1PK          | GSI1SK              |
| ----------- | ----------------------------- | ------- | ------- | ------- | --------------- | ------------------- |
| STUDENT#TOM | STUDENT#TOM                   | STUDENT |         | Tom     | STUDENT#TOM     | STUDENT#TOM         |
| STUDENT#TOM | TEACHER#SIMON#CLASS#MATH      | CLASS   | Math    | Simon   | TEACHER#SIMON   | CLASS#MATH          |
| STUDENT#TOM | TEACHER#MICHAEL#CLASS#PHYSICS | CLASS   | Physics | Michael | TEACHER#MICHAEL | CLASS#PHYSICS       |
| STUDENT#TOM | HOME#USA#CA#LOS_ANGELES       | HOME    |         |         | COUNTRY#USA     | HOME#CA#LOS_ANGELES |

---

### Hierarchical Data Pattern (Composite Sort Key)

See: README.COMPOSITE_SORTKEY.md

A sort key enables range queries.  
If you combine multiple attributes in the sort key, you can filter by some or all of them, but only in the order that values were combined.  
It works great if values have a limited set of potential values. The last value can be used to filter the range of values.

> State#City#Zip Pattern
> GA#ATLANTA#30329
