import { Query as _Query, Mutation as _Mutation, Subscription as _Subscription } from './todos.js';
import { Mutation as __Mutation } from './users.js';


export const Query = {
  ..._Query
};
export const Mutation = {
  ...__Mutation,
  ..._Mutation,
};
export const Subscription = {
  ..._Subscription
};
