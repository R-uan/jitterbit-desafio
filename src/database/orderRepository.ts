import database from "./database.js";
import { IPatchOrderRequest } from "../dtos/IPatchOrderRequest.js";
import type { ICreateOrderRequest } from "../dtos/ICreateOrderRequest.js";

/**
 * OrderRepository
 * Data access layer for Order and Item entities.
 * Handles all database operations related to orders and their items.
 */
export class OrderRepository {
  /**
   * Creates a new order with its associated items in a single transaction.
   * Ensures data consistency by rolling back both operations if either fails.
   *
   * @param input - Order data including items array
   * @param userId - ID of the user creating the order
   * @returns The created order object
   * @throws Error if transaction fails
   */
  public static async createOrder(input: ICreateOrderRequest, userId: number) {
    const [createdOrder] = await database.$transaction([
      database.order.create({
        data: {
          userId,
          value: input.valorTotal,
          orderId: input.numeroPedido,
          creationDate: input.dataCriacao,
        },
      }),
      database.item.createMany({
        data: input.items.map((item) => ({
          price: item.valorItem,
          productId: item.idItem,
          orderId: input.numeroPedido,
          quantity: item.quantidadeItem,
        })),
      }),
    ]);
    return createdOrder;
  }

  /**
   * Retrieves a single order by its ID, including all associated items.
   *
   * @param id - The order ID to search for
   * @returns The order object with nested items array, or null if not found
   */
  public static async findOrderById(id: string) {
    return await database.order.findFirst({
      where: { orderId: id },
      include: {
        items: true,
      },
    });
  }

  /**
   * Deletes an order by its ID.
   *
   * @param orderId - The order ID to delete
   * @returns The deleted order object
   * @throws Error if order not found or deletion fails
   */
  public static async deleteOrderById(orderId: string) {
    return await database.order.delete({ where: { orderId: orderId } });
  }

  /**
   * Retrieves all orders from the database.
   *
   * @param items - Whether to include associated items in the results
   * @returns Array of all orders with optional items
   */
  public static async findOrders(items: boolean) {
    return await database.order.findMany({ include: { items } });
  }

  /**
   * Updates an order and manages its items in a single transaction.
   * Supports updating order fields, removing items, adding new items, and updating existing items.
   *
   * @param orderId - The order ID to update
   * @param data - Update data including optional item operations
   * @returns The updated order object
   * @throws Error if transaction fails
   */
  public static async updateOrder(orderId: string, data: IPatchOrderRequest) {
    const [createdOrder] = await database.$transaction([
      // Update order fields
      database.order.update({
        where: { orderId },
        data: {
          value: data.valorTotal ?? undefined,
          creationDate: data.dataCriacao ?? undefined,
        },
      }),
      // Remove specified items
      database.item.deleteMany({
        where: {
          productId: { in: data.removeItems ?? [] },
          orderId,
        },
      }),
      // Add new items if provided
      ...(data.addItems?.length
        ? [
            database.item.createMany({
              data: data.addItems.map((item) => ({
                orderId,
                price: item.valorItem,
                productId: item.idItem,
                quantity: item.quantidadeItem,
              })),
            }),
          ]
        : []),
      // Update existing items if provided
      ...(data.updateItems?.length
        ? data.updateItems.map((item) =>
            database.item.update({
              where: {
                productId_orderId: {
                  productId: item.idItem,
                  orderId,
                },
              },
              data: {
                price: item.valorItem ?? undefined,
                quantity: item.quantidadeItem ?? undefined,
              },
            }),
          )
        : []),
    ]);
    return createdOrder;
  }
}
