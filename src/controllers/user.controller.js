import bcrypt from "bcrypt";
import { AsyncMiddleware } from "../middlewares/async.middleware.js";
import { userService } from "../services/user.service.js";
import { helper } from "../utils/helper.js";

// user signup
const createUser = AsyncMiddleware(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await userService.findUserByEmail(email);
  if (existingUser) {
    return res
      .status(400)
      .send({ message: "This email is already registered" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  let newUser = await userService.createNewUser({
    name,
    email,
    hashPassword,
  });

  const token = newUser.generateAuthToken();
  newUser = newUser?.toObject();
  delete newUser.password;

  res.header("reindeersoft_user_token", token).send(newUser);
});

// login user
const loginUser = AsyncMiddleware(async (req, res) => {
  const { email, password } = req.body;

  let user = await userService.findUserByEmail(email);
  if (!user)
    return res.status(400).send({ message: "Invalid email or password!!" });

  const isPasswordValid = await helper.comparePassword(password, user.password);
  if (!isPasswordValid)
    return res.status(400).send({ message: "Invalid email or password!!" });

  const token = user.generateAuthToken();
  user = user?.toObject();
  delete user.password;

  res.header("reindeersoft_user_token", token).send(user);
});

const userController = {
  createUser,
  loginUser,
};

export { userController };
