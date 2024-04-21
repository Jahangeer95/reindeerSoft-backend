import { compare } from "bcrypt";

async function comparePassword(bodyPassword, userSavedPassword) {
  const isPasswordValid = await compare(bodyPassword, userSavedPassword);
  return isPasswordValid;
}

function blogNotFound(res) {
  return res.status(400).send({ message: "Blog not found" });
}

const helper = {
  comparePassword,
  blogNotFound,
};

export { helper };
