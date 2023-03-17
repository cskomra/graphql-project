const graphql = require('graphql');
var _ = require('lodash');

// mock data
var usersData = [
  {id: "1", name: 'Bond', age: 36, profession: 'doctor'},
  {id: "13", name: 'Anna', age: 26, profession: 'lawyer'},
  {id: "211", name: 'Bella', age: 16, profession: undefined},
  {id: "19", name: 'Gina', age: 26, profession: 'engineer'},
  {id: "150", name: 'Georgina', age: 46, profession: 'teacher'}
];

var hobbiesData = [
  {id: "1", title: 'Programming', description: 'Using computers to make the world better place', userId: "13"},
  {id: "2", title: 'Rowing', description: 'Sweat and feel better before eating donuts', userId: "211"},
  {id: "3", title: 'Swimming', description: 'Get in the water and learn to become the water', userId: "19"},
  {id: "4", title: 'Fencing', description: 'A hobby for fency people', userId: "150"},
  {id: "5", title: 'Hiking', description: 'Wear hiking boots and explore the world', userId: "1"}
];

var postsData = [
  {id: "1", comment: 'a comment for post one', userId: "1"},
  {id: "2", comment: 'a comment for post two', userId: "19"},
  {id: "3", comment: 'a comment for post three', userId: "1"},
  {id: "4", comment: 'a comment for post four', userId: "150"},
  {id: "5", comment: 'a comment for post five', userId: "1"}
];

const { 
  GraphQLObjectType, 
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList
} = graphql;

// create types
const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'Documentation for user...', // this shows up in the GraphiQL interface
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    profession: {type: GraphQLString},
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args){
        return _.filter(postsData, {userId: parent.id})
      }
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args){
        return _.filter(hobbiesData, {userId: parent.id})
      }
    }
  })
});

const HobbyType = new GraphQLObjectType({
  name: 'Hobby',
  description: 'Documentation for hobby...',
  fields: () => ({
    id: {type: GraphQLID},
    title: {type: GraphQLString},
    description: {type: GraphQLString},
    user: {
      type: UserType,
      resolve(parent, args){
        return _.find(usersData, {id: parent.userId})
      }
    }
  })
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  description: 'Documentation for post...',
  fields: () => ({
    id: {type: GraphQLID},
    comment: {type: GraphQLString},
    user: {
      type: UserType,
      resolve(parent, args){
        return _.find(usersData, {id: parent.userId})
      }
    }
  })
})

// create Root Query - the path that allows us to start traversing through
// like a GET
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Description",
  fields: {
    user: {
      type: UserType,
      args: {id: {type: GraphQLID}}, // for constructor
      resolve(parent, args) {
        // return user data
        return _.find(usersData, {id: args.id})
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args){
        return usersData
      }
    },
    hobby: {
      type: HobbyType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        // return hobby data
        return _.find(hobbiesData, {id: args.id})
      }
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args){
        return hobbiesData
      }
    },
    post: {
      type: PostType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        // return hobby data
        return _.find(postsData, {id: args.id})
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args){
        return postsData
      }
    }
  }
});

// mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType,
      args: {
        // id: {type: GraphQLID}
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString}
      },
      resolve(parent, args) {
        let user = {
          name: args.name,
          age: args.age,
          profession: args.profession
        };
        return user;
      }
    },
    createPost: {
      type: PostType,
      args: {
        // id: {type: GraphQLID},
        comment: {type: GraphQLString},
        userId: {type: GraphQLID}
      },
      resolve(parent, args){
        let post = {
          comment: args.comment,
          userId: args.userId
        };
        return post;
      }
    },
    createHobby: {
      type: HobbyType,
      args: {
        // id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        userId: {type: GraphQLID}
      },
      resolve(parent, args){
        let hobby = {
          title: args.title,
          description: args.description,
          userId: args.userId
        };
        return hobby;
      }
    }
  }
})

/* example GraphiQL
{
  user(id: "1"){
    name
  }
}
*/

module.exports = new GraphQLSchema({
  query: RootQuery, // GET
  mutation: Mutation // CREATE
})