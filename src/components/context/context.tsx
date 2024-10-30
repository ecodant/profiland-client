import {
  ContactRequest,
  LoginFormValues,
  Product,
  ProductInput,
  Review,
  Seller,
} from "@/lib/types";
import { createContext } from "react";

// export const SellerSessionContext = createContext<Seller | undefined>(
//   undefined
// );

export interface ProductsContextType {
  products: Product[];
  // isLoading: boolean;
  // error: string | null;
  // fetchProducts: () => Promise<void>;
  addProduct: (productInput: ProductInput) => Promise<void>;
  handleUpdateProduct: (updatedProduct: Product) => Promise<void>;
  handleDeleteProduct: (id: string) => Promise<void>;
  addComment: (productId: string, comment: string) => Promise<void>;
  // toggleLike: (productId: string) => Promise<void>;
  isDialogOpen: boolean;
}

export const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

export interface UserContextType {
  sessionSeller: Seller;
  sellers: Seller[];
  addReview: (sellerID: string, review: Review) => Promise<void>;
  handleLoginSeller: (credentials: LoginFormValues) => Promise<Seller>;
  sendRequestSeller: (idReciver: string) => Promise<boolean>;
  acceptRuquestSeller: (idRequest: string) => Promise<boolean>;
  rejectRequestSeller: (idRequest: string) => Promise<boolean>;
}

export const SellerContext = createContext<UserContextType | undefined>(
  undefined
);
