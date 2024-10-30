import { useSellers } from "@/hooks/hooks";
import FriendCard from "./FriendCard";

export default function FriendSuggestions() {
  const handleSendRequest = (userId: string) => {
    console.log(`Friend request sent to user ${userId}`);
  };
  const { sellers, sessionSeller } = useSellers();
  const sellerstoSuggest = sellers.filter(
    (seller) => !sessionSeller.contacts.includes(seller.id)
  );

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
