import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import SellerProductsSection from "./products/SellerProductsSection";
import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { useSellers } from "@/hooks/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FriendProductCard from "./friends_products/FriendProductCard";

interface TabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ContentSection({ activeTab, setActiveTab }: TabProps) {
  const [friendsProducts, setFriendProducts] = useState<Product[]>([]);
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" or "oldest"
  const { sessionSeller, sellers } = useSellers();

  useEffect(() => {
    if (!sessionSeller || !sellers) return;

    const allFriendsProducts = sellers
      .filter((seller) => sessionSeller.contacts.includes(seller.id))
      .flatMap((friend) => friend.products)
      .sort((a, b) => {
        const dateA = new Date(a.publicationDate || "").getTime();
        const dateB = new Date(b.publicationDate || "").getTime();
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });

    setFriendProducts(allFriendsProducts);
  }, [sessionSeller, sellers, sortOrder]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="add">Your Products</TabsTrigger>
        <TabsTrigger value="friends">Friends' Products</TabsTrigger>
      </TabsList>

      <TabsContent value="add">
        <SellerProductsSection />
      </TabsContent>

      <TabsContent value="friends">
        {friendsProducts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No friend products to display</p>
            <p className="text-sm mt-2">
              Add some friends to see their products here
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-end p-4">
              <Select onValueChange={setSortOrder} defaultValue="newest">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {friendsProducts.map(
                (product) =>
                  product.state === "PUBLISHED" && (
                    <FriendProductCard key={product.id} product={product} />
                  )
              )}
            </div>
          </>
        )}
      </TabsContent>
    </Tabs>
  );
}
