> Note that filter expressions are inefficient due to order of operations
> Recall that when using a FilterExpression, the query is executed first (1MB limit), and then filter is applied server side

It is best to use indexes/compounded keys to make querying your data more performant
