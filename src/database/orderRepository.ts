import database from "./database";
import type { ICreateOrderRequest } from "../dtos/ICreateOrderRequest";

export class OrderRepository {
  public static async createOrder(input: ICreateOrderRequest) {
    const [createdOrder] = await database.$transaction([
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
          productId: item.idItem,
          orderId: input.numeroPedido,
          quantity: item.quantidadeItem,
        })),
      }),
    ]);

    return createdOrder;
  }

  public static async findOrderById(id: string) {
    return await database.order.findFirst({
      where: { orderId: id },
      include: {
        items: true,
      },
    });
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
