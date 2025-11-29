import z from "zod";
import express from "express";
import { orderSchema } from "./validators";
import { OrderRepository } from "./database/orderRepository";

const app = express();
app.use(express.json());

// Creates a new Order in the database.
app.post("/order", async (req, res) => {
  try {
    // Parses and validates the request body, throwing an error in case of failure.
    // - Parses `dataCriacao` string to a Date object;
    // - Parses `items.idItem` string to number;
    const parseInput = orderSchema.parse(req.body);
    const result = await OrderRepository.createOrder(parseInput);
    return res.status(201).json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: (err as z.ZodError).issues });
    } else {
      console.log(`[ERROR] GET ORDER REQUEST ${{ error: err }}`);
      return res.status(500).send("Unexpected error");
    }
  }
});

// Get order by id
// /order/orderId
app.get("/order/:orderId", async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const result = await OrderRepository.findOrderById(orderId);
    return result
      ? res.status(200).json(result)
      : res.status(404).json(`Order: "${orderId}" not found.`);
  } catch (err) {
    console.log(
      `[ERROR] GET ORDER REQUEST ${{
        orderId,
        error: err,
      }}`,
    );
    return res.status(500).send("An unexpected error has occurred.");
  }
});

app.listen(3000, () => {
  console.log("[DEBUG] Server listening on port 3000");
});
