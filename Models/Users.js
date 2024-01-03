import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
const UsersSchema = new Schema({
  _id: { type: Schema.Types.UUID, default: uuidv4 },
  email: String,
  password: String,
  role: String,
});

const Users = mongoose.model('Users', UsersSchema);

export default Users;
