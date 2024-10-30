import AuthenticationSection from "./components/Authentication/AuthenticationSection";
import { Toaster } from "@/components/ui/toaster";
import Home from "./components/Home/Home";
import { useCallback, useEffect, useState } from "react";
import { ContactRequest, LoginFormValues, Review, Seller } from "./lib/types";
import {
  getAllSellers,
  loginSeller,
  updateSeller,
} from "./services/sellerService";
import { SellerContext } from "./components/context/context";
import { dummySeller } from "./lib/localSession";

import {
  acceptRequest,
  createRequest,
  rejectRequest,
} from "./services/contactRequestService";

export default function App() {
  const [sessionSeller, setSessionSeller] = useState<Seller>(dummySeller);

  const [sellers, setSellers] = useState<Seller[]>([]);

  const fetchSellers = useCallback(async () => {
    try {
      const fetchedSellers = await getAllSellers();
      setSellers(
        fetchedSellers.filter((seller) => seller.id !== sessionSeller.id)
      );
      console.log(sellers);
    } catch (error) {
      console.error("Failed to fetch sellers: ", error);
    }
  }, [sessionSeller.id]);

  useEffect(() => {
    const valueStore = localStorage.getItem("loggedInSeller");
    if (valueStore != null) {
      const sellerStore: Seller = JSON.parse(valueStore);
      setSessionSeller(sellerStore);
    }
    fetchSellers();
  }, []);

  const sendRequestSeller = async (idReciver: string): Promise<boolean> => {
    try {
      const newContactRequest: ContactRequest = {
        id: Date.now().toString(), // Generate a temporary ID
        idEmisor: sessionSeller.id,
        idReciver: idReciver,
        state: "ON_HOLD",
      };
      return await createRequest(newContactRequest);
    } catch (error) {
      console.error("Error sending the request:", error);
      return false;
    }
  };

  const rejectRequestSeller = async (idRequest: string): Promise<boolean> => {
    try {
      return await rejectRequest(idRequest);
    } catch (error) {
      console.error("Error rejecting the request:", error);
      return false;
    }
  };
  const acceptRuquestSeller = async (idRequest: string): Promise<boolean> => {
    try {
      return await acceptRequest(idRequest);
    } catch (error) {
      console.error("Error rejecting the request:", error);
      return false;
    }
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

  const addReview = async (sellerId: string, review: Review) => {
    const sellerToUpdate = sellers.find((s) => s.id === sellerId);
    if (!sellerToUpdate) return;

    const updatedReviews = [...sellerToUpdate.reviews, review];
    try {
      const updatedSeller = await updateSeller(sellerId, {
        ...sellerToUpdate,
        reviews: updatedReviews,
      });

      // Update both sellers list and session seller if needed
      setSellers((prevSellers) =>
        prevSellers.map((s) => (s.id === sellerId ? updatedSeller : s))
      );

      if (sellerId === sessionSeller.id) {
        setSessionSeller(updatedSeller);
        localStorage.setItem("loggedInSeller", JSON.stringify(updatedSeller));
      }
    } catch (error) {
      console.error("Failed to add review:", error);
      throw error;
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      <SellerContext.Provider
        value={{
          sessionSeller,
          sellers,
          addReview,
          handleLoginSeller,
          sendRequestSeller,
          rejectRequestSeller,
          acceptRuquestSeller,
        }}
      >
        <Toaster />
        {sessionSeller.id !== "seller1" ? <Home /> : <AuthenticationSection />}
      </SellerContext.Provider>
    </div>
  );
}
