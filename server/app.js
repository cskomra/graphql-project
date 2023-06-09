const graphql = require('express-graphql');
const express = require('express');

const { graphqlHTTP } = graphql;
const schema = require('./schema/schema');
const testSchema = require('./schema/types_schema');

const app = express();

app.use('/graphql', graphqlHTTP({
  graphiql: true,
  schema: testSchema
}))

app.listen(4000, () => {
  console.log('Listening for requests on my awesome port 4000');
});