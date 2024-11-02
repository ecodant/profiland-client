import { useSellers } from "@/hooks/hooks";
import FriendCard from "./FriendCard";
import { ContactRequest, SellerNotification, Seller } from "@/lib/types";
import { useEffect, useState } from "react";

export default function FriendSuggestions() {
  const { sellers, sessionSeller, setSellers, handleUpdateSeller } =
    useSellers();

  const [sellerstoSuggest, setSuggestedSellers] = useState<Seller[]>([]);

  // const filterSellerToSuggest = sellers.filter(
  //   (seller) => !sessionSeller.contacts.includes(seller.id)
  // );
  useEffect(() => {
    // Only proceed if we have a valid session seller
    if (!sessionSeller) return;

    const sellersToShowInSuggestion = sellers.filter((seller) => {
      // Skip the current logged-in user
      if (seller.id === sessionSeller.id) return false;

      // Check if they're already contacts (friends)
      const isAlreadyContact = sessionSeller.contacts.includes(seller.id);
      if (isAlreadyContact) return false;

      // Check if the logged-in user has already sent a request to this seller
      const hasOutgoingRequest = seller.contactRequests.some(
        (request) => request.idEmisor === sessionSeller.id
      );
      if (hasOutgoingRequest) return false;

      // Check if this seller has already sent a request to the logged-in user
      const hasIncomingRequest = sessionSeller.contactRequests.some(
        (request) => request.idEmisor === seller.id
      );
      if (hasIncomingRequest) return false;

      // If none of the above conditions are met, show this seller as a suggestion
      return true;
    });

    setSuggestedSellers(sellersToShowInSuggestion);
  }, [sellers, sessionSeller]);

  const handleSendRequest = async (receiverId: string) => {
    try {
      const receiverSeller = sellers.find((user) => user.id === receiverId);

      if (!receiverSeller) {
        console.error("Receiver seller not found");
        return;
      }

      const requestId = crypto.randomUUID();

      // Create new contact request
      const newRequest: ContactRequest = {
        id: requestId,
        idEmisor: sessionSeller.id,
        state: "ON_HOLD",
      };

      // Create new notification
      const newNotification: SellerNotification = {
        id: newRequest.id,
        message: `You have a contact request from ${sessionSeller.name}`,
        typeOfNotification: "REQUEST",
      };

      // Create updated seller object with both new request and notification
      const updatedSeller: Seller = {
        ...receiverSeller,
        contactRequests: [...receiverSeller.contactRequests, newRequest],
        notifications: [
          ...(receiverSeller.notifications || []),
          newNotification,
        ], // Notice the fix here
      };

      // Update suggested sellers list
      setSuggestedSellers((prev) =>
        prev.filter((seller) => seller.id !== receiverId)
      );

      // Update the seller in the database
      await handleUpdateSeller(updatedSeller);

      // Update the sellers list in state
      setSellers((prevSellers) =>
        prevSellers.map((seller) =>
          seller.id === receiverId ? updatedSeller : seller
        )
      );
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  return (
    <div className="w-80 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">People You May Know</h2>
      <div className="space-y-4">
        {sellerstoSuggest.map((seller) => (
          <FriendCard
            key={seller.id}
            seller={seller}
            onSendRequest={() => handleSendRequest(seller.id)}
          />
        ))}
      </div>
    </div>
  );
}
