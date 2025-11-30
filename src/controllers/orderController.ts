import { z } from "zod";
import { Request, Response } from "express";
import { orderSchema, patchOrderSchema } from "../common/validators.js";
import { OrderRepository } from "../database/orderRepository.js";
import { PrismaClientKnownRequestError } from "../database/prisma/generated/internal/prismaNamespace.js";

export class OrderController {
  /** Create a new order for the authenticated user */
  public static async createOrder(req: Request, res: Response) {
    try {
      const parseInput = orderSchema.parse(req.body);
      const result = await OrderRepository.createOrder(parseInput, req.userId!);
      return res.status(201).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const issues = (err as z.ZodError).issues.map((issue) => {
          return {
            field: issue.path.join(".") || "unknown",
            message: issue.message,
          };
        });
        return res.status(400).json({ errors: issues });
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
        console.error(`[ERROR] CREATE ORDER REQUEST`, { error: err });
        return res.status(500).send("Unexpected error");
      }
    }
  }

  /** Get all orders, optionally including items */
  public static async getOrders(req: Request, res: Response) {
    try {
      const result = await OrderRepository.findOrders(
        req.query.items === "true",
      );
      return res.status(200).json(result);
    } catch (err) {
      console.error(`[ERROR] GET ORDER LIST REQUEST`, { error: err });
      return res.status(500).send("Unexpected error");
    }
  }

  /** Get a single order by ID */
  public static async getOrderById(req: Request, res: Response) {
    const orderId = req.params.orderId;
    try {
      const result = await OrderRepository.findOrderById(orderId);
      return result
        ? res.status(200).json(result)
        : res.status(404).json({ error: `Order: "${orderId}" not found.` });
    } catch (err) {
      console.error(`[ERROR] GET ORDER REQUEST`, { orderId, error: err });
      return res.status(500).send("An unexpected error has occurred.");
    }
  }

  /** Update an existing order by ID */
  public static async patchOrderById(req: Request, res: Response) {
    const orderId = req.params.orderId;
    try {
      const body = patchOrderSchema.parse(req.body);
      const result = OrderRepository.updateOrder(orderId, body);
      return res.status(200).json(result);
    } catch (err) {
      // Zod validation error
      if (err instanceof z.ZodError) {
        const issues = err.issues.map((issue) => ({
          field: issue.path.join(".") || "unknown",
          message: issue.message,
        }));

        return res.status(400).json({ errors: issues });
      }

      // Prisma known errors
      if (err instanceof PrismaClientKnownRequestError) {
        switch (err.code) {
          // Unique constraint
          case "P2002":
            return res.status(409).json({
              error: {
                reason: "Unique constraint failed",
                message: "A record with this orderId already exists.",
              },
            });
          // Foreign key constraint
          case "P2003":
            return res.status(409).json({
              error: {
                reason: "Foreign key constraint failed",
                message: "One or more referenced items/orders do not exist.",
              },
            });
          // Record not found
          case "P2025":
            return res.status(404).json({
              error: {
                reason: "Record not found",
                message: "The order you're trying to update does not exist.",
              },
            });
        }
      }

      console.error(`[ERROR] PATCH ORDER REQUEST`, err);
      return res.status(500).json({
        error: {
          reason: "Unexpected error",
          message: "Something went wrong while processing the update.",
        },
      });
    }
  }

  /** Delete an order by ID */
  public static async deleteOrderById(req: Request, res: Response) {
    const orderId = req.params.orderId;
    try {
      const result = await OrderRepository.deleteOrderById(orderId);
      return result
        ? res.status(200).json({ deleted: result })
        : res.status(404).json({ error: `Order: '${orderId}' not found.` });
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        return res
          .status(404)
          .json({ error: `Order: '${orderId}' not found.` });
      } else {
        console.error(`[ERROR] DELETE ORDER REQUEST`, { orderId, error: err });
        return res.status(500).send("An unexpected error has occurred.");
      }
    }
  }
}
