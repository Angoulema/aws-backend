import * as z from 'zod';
import { ProductInput } from '../types';

const productSchema = z.object({
  productName: z.string(),
  productType: z.string(),
  price: z.number().nonnegative(),
  currency: z.string(),
  description: z.string(),
  quantity: z.number().nonnegative()
});

export function validateProductBody(body: unknown) {
  const parsed = JSON.parse(body as string);
  const validatedResult = productSchema.parse(parsed);

  return validatedResult as ProductInput
}
