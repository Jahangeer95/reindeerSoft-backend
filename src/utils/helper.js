import { compare } from "bcrypt";

async function comparePassword(bodyPassword, userSavedPassword) {
  const isPasswordValid = await compare(bodyPassword, userSavedPassword);
  return isPasswordValid;
}

function blogNotFound(res) {
  return res.status(400).send({ message: "Blog not found" });
}

function generateSlug(title) {
  // Convert title to lowercase and replace spaces with hyphens
  return title.toLowerCase().replace(/\s+/g, "-");
}

const helper = {
  comparePassword,
  blogNotFound,
  generateSlug,
};

export { helper };
