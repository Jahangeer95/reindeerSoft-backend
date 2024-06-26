import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const token = req.headers["reindeersoft_user_token"];

  if (!token) return res.status(401).send("Access Denied. No Token provided.");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
}
