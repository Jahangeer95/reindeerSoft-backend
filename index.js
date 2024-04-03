import { app } from "./app.js";
import { logger } from "./src/utils/logger.js";
import { router } from "./src/routes/routes.js";
import { errorMiddleware } from "./src/middlewares/error.middleware.js";

const port = process.env.PORT || 4048;

app.use("/", router);
app.use(errorMiddleware);

export const server = app.listen(port, () => {
  logger.info(`[server]: Server is running on port:${port}`);
});
