import { z } from "zod";

const CommentSchema = z.object({
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
export const ContactSchema = z.object({
  id: z.string(),
  idEmisor: z.string(),
  state: z.string(),
});

const ChatMessageSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  content: z.string(),
  timestamp: z.string(),
});

const ChatSchema = z.object({
  chatRoomId: z.string(),
  user1Id: z.string(),
  user2Id: z.string(),
  comments: z.array(ChatMessageSchema),
});

const ReviewSchema = z.object({
  authorId: z.string(),
  authorName: z.string(),
  comment: z.string(),
  calification: z.number().min(0).max(5),
});

const WallSchema = z.object({
  id: z.string(),
  idOwnerSeller: z.string(),
  postsReferences: z.array(z.string()).optional(),
});

const SellerNotificationSchema = z.object({
  id: z.string(),
  message: z.string(),
  typeOfNotification: z.string(),
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
  notifications: z.array(SellerNotificationSchema),
  products: z.array(ProductSchema),
  // stats: z.array(z.string()).optional().default([]),
  chats: z.array(ChatSchema),
  contactRequests: z.array(ContactSchema),
});

export type Seller = z.infer<typeof SellerSchema>;
export type Wall = z.infer<typeof WallSchema>;
export type Review = z.infer<typeof ReviewSchema>;

export type ContactRequest = z.infer<typeof ContactSchema>;
export type Chat = z.infer<typeof ChatSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type SellerNotification = z.infer<typeof SellerNotificationSchema>;
//For Login and Sign Up Section

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

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
