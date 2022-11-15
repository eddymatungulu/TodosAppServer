import { ApolloServer, PubSub } from 'apollo-server';
import pkg from 'mongoose';
const { connect } = pkg;

import typeDefs from './graphql/typeDefs.js';
import {Query, Mutation, Subscription} from './graphql/resolvers/index.js';
import { MONGODB } from './config.js';

const pubsub = new PubSub();

const PORT = process.env.port || 5000;

const server = new ApolloServer({
  typeDefs,
  Query, Mutation, Subscription,
  context: ({ req }) => ({ req, pubsub })
});

connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB Connected');
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch(err => {
    console.error(err)
  })
