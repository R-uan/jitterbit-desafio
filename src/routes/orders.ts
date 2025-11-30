import { Router } from "express";
import { OrderController } from "../controllers/orderController.js";

const router = Router();

/**
 * @openapi
 * /order:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order in the database with associated items.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
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
 *                 example: "v10089015vdb-01"
 *               valorTotal:
 *                 type: number
 *                 example: 1000
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
 *                       example: 500
 *                     quantidadeItem:
 *                       type: number
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             example:
 *               orderId: "v10089015vdb-01"
 *               userId: 42
 *               value: 1000
 *               creationDate: "2025-01-15T10:30:00.000Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               errors:
 *                 - field: "numeroPedido"
 *                   message: "Required"
 *                 - field: "items"
 *                   message: "Array must contain at least 1 element(s)"
 *       409:
 *         description: Unique constraint failed
 *         content:
 *           application/json:
 *             examples:
 *               duplicateOrderId:
 *                 summary: Duplicate order ID
 *                 value:
 *                   error:
 *                     reason: "Unique constraint failed"
 *                     message: "A record with this orderId already exists"
 *               nullConstraint:
 *                 summary: Null constraint violation
 *                 value:
 *                   error:
 *                     reason: "Null constraint failed"
 *                     message: "Order requires an orderId"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example: "Unexpected error"
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
 *     security:
 *       - bearerAuth: []
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
 *         content:
 *           application/json:
 *             examples:
 *               withoutItems:
 *                 summary: Orders without items
 *                 value:
 *                   - orderId: "v10089015vdb-01"
 *                     userId: 42
 *                     value: 1000
 *                     creationDate: "2025-01-15T10:30:00.000Z"
 *                   - orderId: "v10089016vdb-02"
 *                     userId: 43
 *                     value: 500
 *                     creationDate: "2025-01-16T14:20:00.000Z"
 *               withItems:
 *                 summary: Orders with items
 *                 value:
 *                   - orderId: "v10089015vdb-01"
 *                     userId: 42
 *                     value: 1000
 *                     creationDate: "2025-01-15T10:30:00.000Z"
 *                     items:
 *                       - productId: 1
 *                         orderId: "v10089015vdb-01"
 *                         quantity: 2
 *                         price: 500
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example: "Unexpected error"
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
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: "v10089015vdb-01"
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               orderId: "v10089015vdb-01"
 *               userId: 42
 *               value: 1000
 *               creationDate: "2025-01-15T10:30:00.000Z"
 *               items:
 *                 - productId: 1
 *                   orderId: "v10089015vdb-01"
 *                   quantity: 2
 *                   price: 500
 *                 - productId: 2
 *                   orderId: "v10089015vdb-01"
 *                   quantity: 1
 *                   price: 250
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Order: \"v10089015vdb-01\" not found."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example: "An unexpected error has occurred."
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
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: "v10089015vdb-01"
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               deleted:
 *                 orderId: "v10089015vdb-01"
 *                 userId: 42
 *                 value: 1000
 *                 creationDate: "2025-01-15T10:30:00.000Z"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Order: 'v10089015vdb-01' not found."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example: "An unexpected error has occurred."
 */
router.delete("/:orderId", OrderController.deleteOrderById);

/**
 * @openapi
 * /order/{orderId}:
 *   patch:
 *     summary: Update order by ID
 *     description: Updates an order and manages its items. Supports updating order fields, adding new items, removing items, and updating existing items.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID to update
 *         example: "v10089015vdb-01"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valorTotal:
 *                 type: number
 *                 description: Updated total order value
 *                 example: 250.00
 *               dataCriacao:
 *                 type: string
 *                 format: date-time
 *                 description: Updated order creation date
 *                 example: "2024-01-15T10:30:00Z"
 *               addItems:
 *                 type: array
 *                 description: Items to add to the order
 *                 items:
 *                   type: object
 *                   required:
 *                     - idItem
 *                     - quantidadeItem
 *                     - valorItem
 *                   properties:
 *                     idItem:
 *                       type: number
 *                       example: 101
 *                     quantidadeItem:
 *                       type: number
 *                       example: 2
 *                     valorItem:
 *                       type: number
 *                       example: 50.00
 *               removeItems:
 *                 type: array
 *                 description: Product IDs of items to remove from the order
 *                 items:
 *                   type: number
 *                 example: [102, 103]
 *               updateItems:
 *                 type: array
 *                 description: Items to update in the order
 *                 items:
 *                   type: object
 *                   required:
 *                     - idItem
 *                   properties:
 *                     idItem:
 *                       type: number
 *                       example: 101
 *                     quantidadeItem:
 *                       type: number
 *                       example: 5
 *                     valorItem:
 *                       type: number
 *                       example: 45.00
 *           examples:
 *             updateOrderValue:
 *               summary: Update order value only
 *               value:
 *                 valorTotal: 300.00
 *             addAndRemoveItems:
 *               summary: Add and remove items
 *               value:
 *                 addItems:
 *                   - idItem: 104
 *                     quantidadeItem: 3
 *                     valorItem: 25.00
 *                 removeItems: [102]
 *             fullUpdate:
 *               summary: Full order update
 *               value:
 *                 valorTotal: 400.00
 *                 dataCriacao: "2024-01-15T10:30:00Z"
 *                 addItems:
 *                   - idItem: 105
 *                     quantidadeItem: 1
 *                     valorItem: 100.00
 *                 removeItems: [102]
 *                 updateItems:
 *                   - idItem: 101
 *                     quantidadeItem: 5
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             example:
 *               orderId: "v10089015vdb-01"
 *               userId: 42
 *               value: 400
 *               creationDate: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               errors:
 *                 - field: "valorTotal"
 *                   message: "Expected number, received string"
 *                 - field: "addItems.0.idItem"
 *                   message: "Required"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             example:
 *               error:
 *                 reason: "Record not found"
 *                 message: "The order you're trying to update does not exist."
 *       409:
 *         description: Conflict (unique or foreign key constraint failed)
 *         content:
 *           application/json:
 *             examples:
 *               uniqueConstraint:
 *                 summary: Unique constraint violation
 *                 value:
 *                   error:
 *                     reason: "Unique constraint failed"
 *                     message: "A record with this orderId already exists."
 *               foreignKeyConstraint:
 *                 summary: Foreign key constraint violation
 *                 value:
 *                   error:
 *                     reason: "Foreign key constraint failed"
 *                     message: "One or more referenced items/orders do not exist."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error:
 *                 reason: "Unexpected error"
 *                 message: "Something went wrong while processing the update."
 */
router.patch("/:orderId", OrderController.patchOrderById);

export default router;
