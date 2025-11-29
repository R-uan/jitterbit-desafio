import "dotenv/config";
import express from "express";
import authRouter from "./routes/auth";
import orderRouter from "./routes/orders";
import { swaggerUi, specs } from "./swagger";
import { authenticationMiddleware } from "./middlewares/authentication";

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/auth", authRouter);
app.use("/order", authenticationMiddleware, orderRouter);

const server = app.listen(3000, () => {
  console.log("[DEBUG] Server listening on port 3000");
  console.log(
    "[DEBUG] Swagger API documentation: http://localhost:3000/api-docs",
  );
});

server.on("error", (err) => {
  console.log(err);
  process.exit(1); // Exit the process on critical errors
});
