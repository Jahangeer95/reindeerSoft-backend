import jwt from "jsonwebtoken";

function auth(req, res, next) {
  const token = req.header("userToken");
  if (!token) return res.status(401).send("Access Denied. No Token provided.");
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
}

export default auth;
