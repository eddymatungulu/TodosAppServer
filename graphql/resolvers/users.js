import pkg from 'bcryptjs';
import _pkg from 'jsonwebtoken';
import { UserInputError } from 'apollo-server';

import { validateRegisterInput, validateLoginInput } from '../../util/validators.js';
import { SECRET_KEY } from '../../config.js';
import User from '../../models/User.js';

const { compare, hash } = pkg;
const { sign } = _pkg;

function generateToken(user) {
  return sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
}

export const Mutation = {
  async login(_, { username, password }) {
    console.log("Data", { username, password });
    const { errors, valid } = validateLoginInput(username, password);

    if (!valid) {
      throw new UserInputError('Errors', { errors });
    }

    const user = await User.findOne({ username });

    if (!user) {
      errors.general = 'User not found';
      throw new UserInputError('User not found', { errors });
    }

    const match = await compare(password, user.password);
    if (!match) {
      errors.general = 'Wrong crendetials';
      throw new UserInputError('Wrong crendetials', { errors });
    }

    const token = generateToken(user);

    return {
      ...user._doc,
      id: user._id,
      token
    };
  },
  async register(
    _,
    {
      registerInput: { username, email, password, confirmPassword }
    }
  ) {

    // Validate user data
    const { valid, errors } = validateRegisterInput(
      username,
      email,
      password,
      confirmPassword
    );
    if (!valid) {
      throw new UserInputError('Errors', { errors });
    }
    // TODO: Make sure user doesnt already exist
    const user = await User.findOne({ username });
    if (user) {
      throw new UserInputError('Username is taken', {
        errors: {
          username: 'This username is taken'
        }
      });
    }
    // hash password and create an auth token
    password = await hash(password, 12);

    const newUser = new User({
      email,
      username,
      password,
      createdAt: new Date().toISOString()
    });

    const res = await newUser.save();

    const token = generateToken(res);

    return {
      ...res._doc,
      id: res._id,
      token
    };
  }
};
