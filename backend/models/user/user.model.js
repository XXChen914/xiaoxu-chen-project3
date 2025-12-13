import mongoose from "mongoose";
import UserSchema from "./user.schema.js";

const UserModel = mongoose.model("UserModel", UserSchema);

function createUser(user) {
  return UserModel.create(user);
}

function findUserByUsername(username) {
  return UserModel.findOne({ username: username }).exec();
}

function findUserById(userId) {
  return UserModel.findById(userId).exec();
}

export { createUser, findUserByUsername, findUserById };
