import z from "zod";
import express from "express";
import { orderSchema } from "./validators";
import { OrderRepository } from "./database/orderRepository";
import { PrismaClientKnownRequestError } from "./database/prisma/generated/internal/prismaNamespace";

const app = express();
app.use(express.json());

/**
 * POST /order
 * Creates a new order in the database.
 *
 * @param {ICreateOrderRequest} body - The order data
 *   - numeroPedido: string - Order number
 *   - valorTotal: number - Total order value
 *   - dataCriacao: string (ISO date) - Order creation date (parsed to Date)
 *   - items: array of objects
 *     - idItem: string|number - Item ID (parsed to number)
 *     - valorItem: number - Item value
 *     - quantidadeItem: number - Item quantity
 *
 * @returns {201} Created order object
 * @returns {400} Validation error (invalid body format or types)
 * @returns {409} Conflict - Duplicate orderId or null constraint violation
 * @returns {500} Internal server error
 *
 * @throws {ZodError} If request body fails schema validation
 * @throws {PrismaClientKnownRequestError} If database constraint is violated
 */
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
      // Handles validation logic errors.
      return res.status(400).json({ errors: (err as z.ZodError).issues });
    } else if (err instanceof PrismaClientKnownRequestError) {
      // Handles database errors that the client can resolve.
      switch (err.code) {
        // Handles duplicated orderId error.
        case "P2002":
          res.status(409).json({
            error: {
              reason: "Unique constraint failed",
              message: `A record with this orderId already exists`,
            },
          });
          break;
        // Handles NULL primary key error.
        case "P2011":
          res.status(409).json({
            error: {
              reason: "Null constraint failed",
              message: `Order requires an oderId`,
            },
          });
          break;
      }
    } else {
      // Other errors that might require developer's attention.
      console.log(`[ERROR] GET ORDER REQUEST ${{ error: err }}`);
      return res.status(500).send("Unexpected error");
    }
  }
});

/**
 * GET /order/:orderId
 * Retrieves an order by its ID.
 *
 * @param {string} orderId - The order ID to retrieve
 * @returns {200} Order object if found
 * @returns {404} Order not found
 * @returns {500} Internal server error
 */
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
