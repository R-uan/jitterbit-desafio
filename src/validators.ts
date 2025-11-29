import z from "zod";

const itemSchema = z.object({
  // converts string → number
  idItem: z.coerce.number(),
  valorItem: z.coerce.number(),
  quantidadeItem: z.coerce.number(),
});

// Define the order schema
export const orderSchema = z.object({
  numeroPedido: z.string(),
  valorTotal: z.coerce.number(),
  // converts string → Date
  dataCriacao: z.coerce.date(),
  items: z.array(itemSchema),
});
