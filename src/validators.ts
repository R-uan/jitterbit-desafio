import z from "zod";

/**
 * Item request schema validation
 * Validates individual order items with automatic type coercion.
 *
 * Fields:
 * - idItem: string → number - Product identifier
 * - valorItem: string → number - Item unit price in decimal format
 * - quantidadeItem: string → number - Item quantity
 *
 */
const itemSchema = z.object({
  // converts string → number
  idItem: z.coerce.number(),
  valorItem: z.coerce.number(),
  quantidadeItem: z.coerce.number(),
});

/**
 * Order request schema validation
 * Validates complete order requests with type coercion and nested item validation.
 *
 * Fields:
 * - numeroPedido: string - Unique order identifier (no coercion)
 * - valorTotal: string → number - Total order value in decimal format
 * - dataCriacao: string → Date - Order creation date (ISO 8601 or similar format)
 * - items: array of validated items - Must contain at least one item
 */
export const orderSchema = z.object({
  numeroPedido: z.string(),
  valorTotal: z.coerce.number(),
  // converts string → Date
  dataCriacao: z.coerce.date(),
  items: z.array(itemSchema),
});
