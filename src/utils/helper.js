import { compare } from "bcrypt";

async function comparePassword(bodyPassword, userSavedPassword) {
  const isPasswordValid = await compare(bodyPassword, userSavedPassword);
  return isPasswordValid;
}

const helper = {
  comparePassword,
};

export { helper };
