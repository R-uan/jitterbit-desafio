// src/controllers/orderController.ts
import { z } from "zod";
import { orderSchema } from "../validators";
import { Request, Response } from "express";
import { OrderRepository } from "../database/orderRepository";
import { PrismaClientKnownRequestError } from "../database/prisma/generated/internal/prismaNamespace";

export async function createOrder(req: Request, res: Response) {
  try {
    const parseInput = orderSchema.parse(req.body);
    const result = await OrderRepository.createOrder(parseInput);
    return res.status(201).json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: (err as z.ZodError).issues });
    } else if (err instanceof PrismaClientKnownRequestError) {
      switch ((err as PrismaClientKnownRequestError).code) {
        case "P2002":
          res.status(409).json({
            error: {
              reason: "Unique constraint failed",
              message: `A record with this orderId already exists`,
            },
          });
          break;
        case "P2011":
          res.status(409).json({
            error: {
              reason: "Null constraint failed",
              message: `Order requires an orderId`,
            },
          });
          break;
      }
    } else {
      console.log(
        `[ERROR] CREATE ORDER REQUEST ${JSON.stringify({ error: err })}`,
      );
      return res.status(500).send("Unexpected error");
    }
  }
}

export async function getOrders(req: Request, res: Response) {
  try {
    const result = await OrderRepository.findOrders(req.query.items === "true");
    return res.status(200).json(result);
  } catch (err) {
    console.log(
      `[ERROR] GET ORDER LIST REQUEST ${JSON.stringify({ error: err })}`,
    );
    return res.status(500).send("Unexpected error");
  }
}

export async function getOrderById(req: Request, res: Response) {
  const orderId = req.params.orderId;
  try {
    const result = await OrderRepository.findOrderById(orderId);
    return result
      ? res.status(200).json(result)
      : res.status(404).json({ error: `Order: "${orderId}" not found.` });
  } catch (err) {
    console.log(
      `[ERROR] GET ORDER REQUEST ${JSON.stringify({ orderId, error: err })}`,
    );
    return res.status(500).send("An unexpected error has occurred.");
  }
}

export async function deleteOrderById(req: Request, res: Response) {
  const orderId = req.params.orderId;
  try {
    const result = await OrderRepository.deleteOrderById(orderId);
    return result
      ? res.status(200).json({ deleted: result })
      : res.status(404).json({ error: `Order: "${orderId}" not found.` });
  } catch (err) {
    console.log(
      `[ERROR] DELETE ORDER REQUEST ${JSON.stringify({ orderId, error: err })}`,
    );
    return res.status(500).send("An unexpected error has occurred.");
  }
}
