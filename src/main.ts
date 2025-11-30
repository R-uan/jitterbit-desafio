import "dotenv/config";
import express from "express";
import { getSecret } from "./common/jwt.js";
import authRouter from "./routes/auth.js";
import orderRouter from "./routes/orders.js";
import { swaggerUi, specs } from "./common/swagger.js";
import { authenticationMiddleware } from "./middlewares/authentication.js";
import { loggingMiddleware } from "./middlewares/logging.js";

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(loggingMiddleware);
app.use("/auth", authRouter);
app.use("/order", authenticationMiddleware, orderRouter);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`[DEBUG] Server listening on port ${port}`);
  console.log(`[DEBUG] Swagger docs: http://localhost:${port}/api-docs`);
  getSecret();
});

server.on("error", (err) => {
  console.log(err);
  process.exit(1); // Exit the process on critical errors
});
