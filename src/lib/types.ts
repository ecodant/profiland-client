import { z } from "zod";

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
  sellerId: z.string(),
});

export const productInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  image: z.string(),
  category: z.string().min(1, "Category is required"),
  price: z.number().positive("Price must be positive"),
  state: z.string().min(1, "State is required"),
});

export type Product = z.infer<typeof ProductSchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type ProductInput = z.infer<typeof productInputSchema>;

// User Models Section

const ReviewSchema = z.object({
  id: z.string(),
  authorRef: z.string(),
  ownerRef: z.string(),
  comment: z.string(),
  calification: z.number().min(0).max(5),
});

const WallSchema = z.object({
  id: z.string(),
  idOwnerSeller: z.string(),
  postsReferences: z.array(z.string()).optional(),
});

// Seller schema
export const SellerSchema = z.object({
  id: z.string(),
  name: z.string().nonempty(),
  email: z.string().email(),
  password: z.string().min(8),
  lastName: z.string().nonempty(),
  license: z.string().optional(),
  address: z.string().optional(),
  profileImg: z.string().optional(),

  // Sets from Java can be modeled as arrays in TypeScript
  reviews: z.array(ReviewSchema),
  contacts: z.array(z.string()).optional().default([]),
  products: z.array(z.string()).optional().default([]),
  stats: z.array(z.string()).optional().default([]),
  chats: z.array(z.string()).optional().default([]),
  contactRequests: z.array(z.string()).optional().default([]),

  wall: WallSchema.optional(),
});

export type Seller = z.infer<typeof SellerSchema>;
export type Wall = z.infer<typeof WallSchema>;
export type Review = z.infer<typeof ReviewSchema>;

//For Login and Sign Up Section

// Zod schema for login form
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Zod schema for sign up form
export const signUpSchema = z
  .object({
    personalId: z.string().min(1, "Personal ID is required"),
    license: z.enum(["Seller", "Admin"], {
      required_error: "Please select a license",
    }),
    name: z.string().min(1, "Name is required"),
    lastname: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(1, "Address is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
