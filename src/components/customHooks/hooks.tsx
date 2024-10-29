import { useContext } from "react";
import {
  ProductsContext,
  ProductsContextType,
  SellerContext,
  UserContextType,
} from "../context/context";

export const useProducts = (): ProductsContextType => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};

export const useSellers = (): UserContextType => {
  const context = useContext(SellerContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};
