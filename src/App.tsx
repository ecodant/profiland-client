import AuthenticationSection from "./components/Authentication/AuthenticationSection";
import { Toaster } from "@/components/ui/toaster";
import Home from "./components/Home/Home";
import { useCallback, useEffect, useState } from "react";

import { SellerContext } from "./components/context/context";

import { LoginFormValues, Seller } from "./lib/types";
import {
  getAllSellers,
  loginSeller,
  updateSeller,
} from "./services/sellerService";
import { dummySeller } from "./lib/localSession";

export default function App() {
  const [sessionSeller, setSessionSeller] = useState<Seller>(dummySeller);
  const [sellers, setSellers] = useState<Seller[]>([]);

  const fetchSellers = useCallback(async () => {
    try {
      const fetchedSellers = await getAllSellers();
      setSellers(
        fetchedSellers.filter((seller) => seller.id !== sessionSeller.id)
      );
    } catch (error) {
      console.error("Failed to fetch sellers: ", error);
    }
  }, [sessionSeller.id]);

  const handleUpdateSeller = async (
    sellerToUpdate: Seller
  ): Promise<Seller> => {
    try {
      const sellerUpdated = await updateSeller(
        sellerToUpdate.id,
        sellerToUpdate
      );
      if (sellerUpdated) {
        setSessionSeller(sellerUpdated);
        return sellerUpdated;
      }
    } catch (error) {
      console.error("Error sending the request:", error);
    }
    return dummySeller;
  };

  const handleLoginSeller = async (data: LoginFormValues): Promise<Seller> => {
    try {
      const seller = await loginSeller(data);
      if (seller) {
        setSessionSeller(seller);
        localStorage.setItem("loggedInSeller", JSON.stringify(seller));
        await fetchSellers();
        return seller;
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
    return sessionSeller;
  };

  useEffect(() => {
    const initializeSession = async () => {
      const valueStore = localStorage.getItem("loggedInSeller");

      if (valueStore) {
        try {
          const sellerStore: Seller = JSON.parse(valueStore);

          if (sellerStore.email && sellerStore.password) {
            const sellerReLogged = await handleLoginSeller({
              email: sellerStore.email,
              password: sellerStore.password,
            });
            if (sellerReLogged) {
              setSessionSeller(sellerReLogged);
            }
          } else {
            console.warn("Invalid session data, logging out...");
            localStorage.removeItem("loggedInSeller");
          }
        } catch (error) {
          console.error("Error re-authenticating:", error);
          localStorage.removeItem("loggedInSeller");
        }
      }
      await fetchSellers();
    };

    initializeSession();
  }, [fetchSellers]);

  return (
    <div className="w-full overflow-x-hidden">
      <SellerContext.Provider
        value={{
          sessionSeller,
          setSessionSeller,
          setSellers,
          sellers,
          handleUpdateSeller,
          handleLoginSeller,
        }}
      >
        <Toaster />
        {sessionSeller.id !== "seller1" ? <Home /> : <AuthenticationSection />}
      </SellerContext.Provider>
    </div>
  );
}
