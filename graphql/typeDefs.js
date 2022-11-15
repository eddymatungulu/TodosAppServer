import { gql } from 'apollo-server';

export default gql`
  type Todo {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    complete: [Complete]!
  }

  type Complete {
    id: ID!
    createdAt: String!
    username: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    getTodos: [Todo]
    getTodo(todoId: ID!): Todo
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createTodo(body: String!): Todo!
    deleteTodo(todoId: ID!): String!
    completeTodo(postId: ID!): Todo!
  }
  type Subscription {
    newTodo: Todo!
  }
`;
