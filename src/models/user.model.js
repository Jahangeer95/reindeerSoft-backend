import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";

const { sign } = jwt;

export const userSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 5,
      maxLength: 50,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minLength: 7,
      maxLength: 100,
      required: true,
    },
  },
  {
    // set version key to false to exclude document versioning i.e __v
    versionKey: false,
  }
);

userSchema.methods.generateAuthToken = function () {
  const token = sign({ _id: this._id }, process.env.JWT_SECRET_KEY);
  return token;
};

export const ReindeerSoftUser = model("ReindeerSoftUser", userSchema);
