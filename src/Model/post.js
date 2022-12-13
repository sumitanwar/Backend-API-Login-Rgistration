const mongoose = require("mongoose");
const User = require("./user");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  image: { type: String },
  user: { type: ObjectId, ref: "User" },
});
const PostModel = mongoose.model("PostModel", PostSchema);
module.exports = PostModel;
