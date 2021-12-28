## @aws-sdk/node-http-handler

```js
const { NodeHttpHandler } = require('@aws-sdk/node-http-handler');
const { Agent } = require('http');
const dynamodbClient = new DynamoDBClient({
  requestHandler: new NodeHttpHandler({
    httpAgent: new Agent({ keepAlive: false }),
  }),
});
```
