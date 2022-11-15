import { AuthenticationError, UserInputError } from 'apollo-server';

import Todo from '../../models/Todo.js';
import checkAuth from '../../util/check-auth.js';

export const Query = {
  async getTodos() {
    try {
      const todos = await Todo.find().sort({ createdAt: -1 });
      return todos;
    } catch (err) {
      throw new Error(err);
    }
  },
  async getTodo(_, { todoId }) {
    try {
      const todo = await Todo.findById(todoId);
      if (todo) {
        return todo;
      } else {
        throw new Error('todo not found');
      }
    } catch (err) {
      throw new Error(err);
    }
  }
};
export const Mutation = {
  async createTodo(_, { body }, context) {
    const user = checkAuth(context);

    if (body.trim() === '') {
      throw new Error('Todo body must not be empty');
    }

    const newTodo = new Todo({
      body,
      user: user.id,
      username: user.username,
      createdAt: new Date().toISOString()
    });

    const todo = await newTodo.save();

    context.pubsub.publish('NEW_TODO', {
      newTodo: todo
    });

    return todo;
  },
  async deleteTodo(_, { todoId }, context) {
    const user = checkAuth(context);

    try {
      const todo = await Todo.findById(todoId);
      if (user.username === todo.username) {
        await todo.delete();
        return 'Todo deleted successfully';
      } else {
        throw new AuthenticationError('Action not allowed');
      }
    } catch (err) {
      throw new Error(err);
    }
  },
  async completeTodo(_, { todoId }, context) {
    const { username } = checkAuth(context);

    const todo = await Todo.findById(todoId);
    if (todo) {
      if (todo.complete.find((complete) => complete.username === username)) {
        // Todo already Complete, unComplet it
        todo.complete = todo.complete.filter((complete) => complete.username !== username);
      } else {
        // Not Completed, Complete todo
        todo.complete.push({
          username,
          createdAt: new Date().toISOString()
        });
      }

      await todo.save();
      return todo;
    } else
      throw new UserInputError('Todo not found');
  }
};
export const Subscription = {
  newTodo: {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_TODO')
  }
};
