import mongoose from "mongoose";

const Schema = mongoose.Schema;

const USER_SCHEMA = new Schema({
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  tasks: [{ type: mongoose.Types.ObjectId, ref: "Todo" }],
});

export default mongoose.model("User", USER_SCHEMA);
