import { z } from 'zod';

const CommentSchema = z.object({
  id: z.string(),
  date: z.string(),
  author: z.string(),
  content: z.string(),
});

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  image: z.string(),
  category: z.string(),
  price: z.number(),
  state: z.string(),
  publicationDate: z.string(),
  comments: z.array(CommentSchema),
  likes: z.number(),
  sellerId: z.string()
});

export const productInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  image: z.string(),
  category: z.string().min(1, "Category is required"),
  price: z.number().positive("Price must be positive"),
  state: z.string().min(1, "State is required"),
})

export type Product = z.infer<typeof ProductSchema>;
export type ProductInput = z.infer<typeof productInputSchema>;
export type Comment = z.infer<typeof CommentSchema>;