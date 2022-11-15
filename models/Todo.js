import pkg from 'mongoose';
const { model, Schema } = pkg;

const todoSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  
  isComplete: [
    {
      username: String,
      createdAt: String
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  }
});

export default model('Todo', todoSchema);
