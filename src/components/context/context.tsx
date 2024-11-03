import { LoginFormValues, Seller } from "@/lib/types";
import { createContext } from "react";

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
