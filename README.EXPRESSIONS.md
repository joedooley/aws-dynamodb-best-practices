## Expression Basics

- **Condition** expressions are used when manipulating individual items to only change an item when certain conditions are true.
- **Projection** expressions are used to specify a subset of attributes you want to receive when reading Items. We used these in our GetItem calls in the previous lesson.
- **Update** expressions are used to update a particular attribute in an existing Item.
- **Key condition** expressions are used when querying a table with a composite primary key to limit the items selected.
- **Filter** expressions allow you to filter the results of queries and scans to allow for more efficient responses.

---

## Expression Placeholders

### Expression Attribute Names

There are times when you want to write an expression for a particular attribute, but you can't properly represent that attribute name due to DynamoDB limitations. This could be because:

- Your attribute is a reserved word. DynamoDB has a huge list of reserved words, including words like "Date", "Year", and "Name". If you want to use those as attribute names, you'll need to use expression attribute name placeholders.
- Your attribute name contains a dot. DynamoDB uses dot syntax to access nested items in a document. If you used a dot in your top-level attribute name, you'll need to use a placeholder.
- Your attribute name begins with a number. DynamoDB won't let you use attribute names that begin with a number in your expression syntax.

> When using expression attribute names, the placeholder must begin with a pound sign ("#").

```
ExpressionAttributeNames: {
    '#dob': 'DateOfBirth',
  }
```

### Expression Attribute Values

> Expression attribute values must start with a colon (":") rather than a pound sign  
> Expression attribute values must specify the type for the value they are referencing, e.g.: {":agelimit": {"N": 21} }

```
ExpressionAttributeValues: {
    ':dob': '1937-04-17',
  }
```
