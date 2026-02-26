import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive'),
  compareAtPrice: z.number().optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  variants: z.array(z.object({
    size: z.string(),
    color: z.string(),
    sku: z.string(),
    stock: z.number().min(0),
  })),
});

export type ProductInput = z.infer<typeof productSchema>;
