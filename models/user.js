const { Schema, model } = require("mongoose");
//Example from Module Code was used, naming conventions follow Module Challenge
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: "What is your name it is required",
    },
    email: {
      type: String,
      unique: true,
      required: "What is your name it is required",
      match: [/.+@.+\..+/],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});
const User = model("User", userSchema);
module.exports = User;