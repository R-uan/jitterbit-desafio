import express from "express";
import orderRouter from "./routes/orders";
import { swaggerUi, specs } from "./swagger";

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/order", orderRouter);

app.listen(3000, () => {
  console.log("[DEBUG] Server listening on port 3000");
  console.log(
    "[DEBUG] Swagger API documentation: http://localhost:3000/api-docs",
  );
});
