import { ReindeerSoftUser } from "../models/user.model.js";

async function findUserByEmail(email) {
  const user = await ReindeerSoftUser.findOne({
    email: email,
  });

  return user;
}

async function createNewUser({ name, email, hashPassword }) {
  let user = new ReindeerSoftUser({
    name,
    email,
    password: hashPassword,
  });

  user = await user.save();

  return user;
}

const userService = {
  findUserByEmail,
  createNewUser,
};

export { userService };
