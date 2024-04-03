import mongoose from "mongoose";

function database(logger) {
  const database_url = process.env.DATABASE_URL;

  mongoose
    .connect(database_url)
    .then(() => logger.info(`Connected to MongoDB Database ...`))
    .catch((error) => logger.error(error.message));
}

export { database };
