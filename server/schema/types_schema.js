const { 
  GraphQLObjectType, 
  GraphQLSchema, 
  GraphQLID, 
  GraphQLString, 
  GraphQLInt, 
  GraphQLBoolean, 
  GraphQLFloat, 
  GraphQLNonNull} = require("graphql");

// Scalar Types
/*
  String = GraphQLString
  int
  Float
  Boolean
  ID
*/

const Person = new GraphQLObjectType({
  name: 'Person',
  description: 'represents a person type',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: new GraphQLNonNull(GraphQLString)},
    age: {type: GraphQLInt},
    isMarried: {type: GraphQLBoolean},
    gpa: {type: GraphQLFloat},
    justAType: {
      type: Person,
      resolve(parent, args){
        return parent;
      }
    }
  })
})

// RootQuery
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Description',
  fields: {
    person: {
      type: Person,
      resolve(parent, args){
        let personObj = {
          name: 'Antonio',
          age: 35,
          isMarried: true,
          gpa: 4.0
        }
        return personObj;
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
})
