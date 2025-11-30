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

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(50),
});

export const signUpSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(50),
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
});

export const patchOrderSchema = z.object({
  valorTotal: z.number().optional(),
  dataCriacao: z.coerce.date().optional(),

  removeItems: z.array(z.number()).optional(),

  updateItems: z
    .array(
      z.object({
        idItem: z.coerce.number(), // converts string → number
        valorItem: z.number().optional(),
        quantidadeItem: z.number().optional(),
      }),
    )
    .optional(),

  addItems: z
    .array(
      z.object({
        idItem: z.coerce.number(), // converts string → number
        valorItem: z.number(),
        quantidadeItem: z.number(),
      }),
    )
    .optional(),
});
