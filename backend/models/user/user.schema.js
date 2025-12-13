const Schema = require("mongoose").Schema;

exports.UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      require: true,
      index: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  { collection: "users" }
);
