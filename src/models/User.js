import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  user_id: { type: String, sparse: true },
});

export default mongoose.model("User", userSchema);
