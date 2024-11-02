import { LoginFormValues, Seller } from "@/lib/types";
import { createContext } from "react";
// export interface ProductsContextType {
//   products: Product[];
//   // isLoading: boolean;
//   // error: string | null;
//   // fetchProducts: () => Promise<void>;
//   addProduct: (productInput: ProductInput) => Promise<void>;
//   handleUpdateProduct: (updatedProduct: Product) => Promise<void>;
//   handleDeleteProduct: (id: string) => Promise<void>;
//   addComment: (productId: string, comment: string) => Promise<void>;
//   // toggleLike: (productId: string) => Promise<void>;
//   isDialogOpen: boolean;
// }

// export const ProductsContext = createContext<ProductsContextType | undefined>(
//   undefined
// );

export interface UserContextType {
  sessionSeller: Seller;
  sellers: Seller[];
  setSellers: React.Dispatch<React.SetStateAction<Seller[]>>;
  setSessionSeller: React.Dispatch<React.SetStateAction<Seller>>;
  handleLoginSeller: (credentials: LoginFormValues) => Promise<Seller>;
  handleUpdateSeller: (sellerToUpdate: Seller) => Promise<Seller>;
}

export const SellerContext = createContext<UserContextType | undefined>(
  undefined
);
