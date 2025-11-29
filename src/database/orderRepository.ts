import type { ICreateOrderRequest } from "../dtos/ICreateOrderRequest";
import database from "./database";

export class OrderRepository {
  public static async createOrder(input: ICreateOrderRequest) {
    try {
      await database.$transaction([
        database.order.create({
          data: {
            value: input.valorTotal,
            orderId: input.numeroPedido,
            creationDate: input.dataCriacao,
          },
        }),
        database.item.createMany({
          data: input.items.map((item) => ({
            price: item.valorItem,
            productId: item.iditem,
            orderId: input.numeroPedido,
            quantity: item.quantidadeItem,
          })),
        }),
      ]);
      return false;
    } catch (error) {
      console.log("Failed to create a new Order: ${error}");
      return false;
    }
  }

  public static async findOrderById(id: string) {
    return await database.order.findUnique({ where: { orderId: id } });
  }

  public static async deleteOrderById(id: string) {
    try {
      return await database.order.delete({ where: { orderId: id } });
    } catch {
      return null;
    }
  }

  public static async findOrders() {
    return database.order.findMany();
  }
}
