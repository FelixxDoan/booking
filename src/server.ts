import createApp from "./app.js";
import { connectDB } from "./config/db.js";
import env from "./config/env.js";
import { createLogger } from "./common/libs/logger.js";

const { port, level, nodeEnv } = env();
const logger = createLogger({ nodeEnv, level });

await connectDB(logger);

const app = createApp();

app.listen(port, () => logger[level]("Server started successfully"));
