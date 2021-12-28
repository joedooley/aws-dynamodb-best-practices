### Overloading Sort Key

https://aws.amazon.com/blogs/database/using-sort-keys-to-organize-data-in-amazon-dynamodb/
https://amazon-dynamodb-labs.com/design-patterns/ex4gsioverload.html

> Overloading the Sort Key / GSI allows multiple access patterns while paying for only 1 index instead of multiples.  
> The value of the Sort Key / Index stores a different value depending on context
> Instead of predefining a database schema, your application has the flexibility to provide the context/definition of what is being stored
> Use prefixes to identify the type of the item (e# = employee, u# = user, c# = customer) - this allows storing multiple types in one table

For example, say you have an **employees** table and have the following access patterns:

- Query all employees of a state
- Query all employees with one specific current title
- Query all employees who had ever one specific title
- Query employees by name

#### Employee Table

| PK    | SK                                   |     Name      | Hire Date |
| ----- | ------------------------------------ | :-----------: | --------- |
| e#129 | current_title#Director of Technology | Rhianna Cohen |
| e#129 | previous_title#System Architect      | Rhianna Cohen |
| e#129 | state#CA                             | Rhianna Cohen |
| e#129 | root                                 | Rhianna Cohen | 7/1/1995  |
| e#146 | state#TX                             |  Davy Ivens   |
| e#146 | current_title#Desktop Support        |  Davy Ivens   |
| e#146 | root                                 |  Davy Ivens   | 2/16/2010 |

> The data for one employee is spread over multiple records and the sort key is defined for optimal speed access

### Employee Table - GSI

| GSI Key (SK)                         | GSI Sort Key (Name) | PK    | Hire Date |
| ------------------------------------ | :-----------------: | ----- | --------- |
| current_title#Director of Technology |    Rhianna Cohen    | e#129 |
| previous_title#System Architect      |    Rhianna Cohen    | e#129 |
| state#CA                             |    Rhianna Cohen    | e#129 |
| root                                 |    Rhianna Cohen    | e#129 | 7/1/1995  |
| state#TX                             |     Davy Ivens      | e#146 |
| current_title#Desktop Support        |     Davy Ivens      | e#146 |
| root                                 |     Davy Ivens      | e#146 | 2/16/2010 |

> This **single** GSI handles all the access patterns defined above
