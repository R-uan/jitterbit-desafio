import database from "./database";
import type { ICreateOrderRequest } from "../dtos/ICreateOrderRequest";
import { IPatchOrderRequest } from "../dtos/IPatchOrderRequest";

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
   * @param {ICreateOrderRequest} input
   * @returns {Promise<Order>} The created order object
   * @throws {Error} If transaction fails
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
   * @param {string} id - The order ID (numeroPedido) to search for
   *
   * @returns {Promise<Order | null>} The order object with nested items array,
   *   or null if no order is found
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
   * @param {string} orderId - The order ID (orderId) to delete
   *
   * @returns {Promise<Order | null>} The deleted order object if successful,
   *   null if the order was not found or deletion failed
   */
  public static async deleteOrderById(orderId: string) {
    try {
      return await database.order.delete({ where: { orderId: orderId } });
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  /**
   * Retrieves all orders from the database.
   *
   * @returns {Promise<Order[]>} Array of all orders, or empty array if none exist
   */
  public static async findOrders(items: boolean) {
    return await database.order.findMany({ include: { items } });
  }

  public static async updateOrder(orderId: string, data: IPatchOrderRequest) {
    const [createdOrder] = await database.$transaction([
      database.order.update({
        where: { orderId },
        data: {
          value: data.valorTotal ?? undefined,
          creationDate: data.dataCriacao ?? undefined,
        },
      }),

      database.item.deleteMany({
        where: {
          productId: { in: data.removeItems ?? [] },
          orderId,
        },
      }),

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
