// src/routes/orders.ts
import { Router } from "express";
import { OrderController } from "../controllers/orderController";

const router = Router();

/**
 * @openapi
 * /order:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order in the database with associated items.
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numeroPedido
 *               - valorTotal
 *               - dataCriacao
 *               - items
 *             properties:
 *               numeroPedido:
 *                 type: string
 *                 example: "ORD-2025-001"
 *               valorTotal:
 *                 type: number
 *                 example: 199.99
 *               dataCriacao:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-15T10:30:00Z"
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   properties:
 *                     idItem:
 *                       type: string
 *                       example: "1"
 *                     valorItem:
 *                       type: number
 *                       example: 99.99
 *                     quantidadeItem:
 *                       type: number
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Unique constraint failed
 *       500:
 *         description: Internal server error
 */
router.post("/", OrderController.createOrder);

/**
 * @openapi
 * /order/list:
 *   get:
 *     summary: List all orders
 *     description: Retrieves all orders from the database.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: query
 *         name: items
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: Include items array in response
 *     responses:
 *       200:
 *         description: List of orders retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get("/list", OrderController.getOrders);

/**
 * @openapi
 * /order/{orderId}:
 *   get:
 *     summary: Get order by ID
 *     description: Retrieves a single order by its ID, including all associated items.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: "ORD-2025-001"
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.get("/:orderId", OrderController.getOrderById);

/**
 * @openapi
 * /order/{orderId}:
 *   delete:
 *     summary: Delete order by ID
 *     description: Deletes an order and its associated items by order ID.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: "ORD-2025-001"
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:orderId", OrderController.deleteOrderById);

export default router;
