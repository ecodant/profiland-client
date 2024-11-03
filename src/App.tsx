import AuthenticationSection from "./components/Authentication/AuthenticationSection";
import { Toaster } from "@/components/ui/toaster";
import Home from "./components/Home/Home";
import { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SellerContext } from "./components/context/context";

import { LoginFormValues, Seller } from "./lib/types";
import {
  getAllSellers,
  loginSeller,
  updateSeller,
} from "./services/sellerService";
import { dummySeller } from "./lib/localSession";
import Navbar from "./components/Header/NavBar";
import Profile from "./components/Profile/Profile";
// import ChatSection from "./components/Chat/ChatSection"; // Future import

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
      if (sellerUpdated.id === sessionSeller.id) {
        setSessionSeller(sellerUpdated);
      }
      return sellerUpdated;
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
    <BrowserRouter>
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
          {/* Show Navbar only when user is logged in */}
          {sessionSeller.id !== "seller1" && <Navbar />}

          <Routes>
            {/* Auth route - redirects to home if logged in */}
            <Route
              path="/auth"
              element={
                sessionSeller.id !== "seller1" ? (
                  <Navigate to="/" replace />
                ) : (
                  <AuthenticationSection />
                )
              }
            />

            {/* Main routes - redirect to auth if not logged in */}
            <Route
              path="/"
              element={
                sessionSeller.id === "seller1" ? (
                  <Navigate to="/auth" replace />
                ) : (
                  <Home />
                )
              }
            />

            <Route
              path="/profile"
              element={
                sessionSeller.id === "seller1" ? (
                  <Navigate to="/auth" replace />
                ) : (
                  <Profile />
                )
              }
            />

            {/* Commented Chat route for future implementation */}
            {/* <Route
              path="/chats"
              element={
                sessionSeller.id === "seller1" ? (
                  <Navigate to="/auth" replace />
                ) : (
                  <ChatSection />
                )
              }
            /> */}

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SellerContext.Provider>
      </div>
    </BrowserRouter>
  );
}
