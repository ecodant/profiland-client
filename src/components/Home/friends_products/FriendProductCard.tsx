import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, MessageCircle } from "lucide-react";
import { Product, Comment, Seller, Review, SellerNotification } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useSellers } from "@/hooks/hooks";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SellerReviewDialog from "../review/SellerReviewDialog";



interface FriendProductProps {
  product: Product;
}

const LocationMap = ({ address }: { address: string }) => {
  const encodedAddress = encodeURIComponent(address);
  
  return (
    <div className="h-48 w-full rounded-md overflow-hidden">
      <iframe
        className="w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_MAPS_KEY}&q=${encodedAddress}`}
      ></iframe>
    </div>
  );
};

export default function FriendProductCard({ product }: FriendProductProps) {
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [displayComments, setDisplayComments] = useState<{
    [key: string]: boolean;
  }>({});
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [owner, setOwnerSeller] = useState<Seller | null>(null);
  const { sessionSeller, handleUpdateSeller, setSellers, sellers } = useSellers();

  useEffect(() => {
    const productOwner = sellers.find(
      (seller) => seller.id === product.sellerId
    );
    if (productOwner) setOwnerSeller(productOwner);
  }, [product.sellerId, sellers]);

  const toggleComments = (productId: string) => {
    setDisplayComments((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleToggleLike = async (product: Product) => {
    const ownerSeller = sellers.find(
      (seller) => seller.id === product.sellerId
    );
    if (!ownerSeller) return;

    try {
      const updatedProducts = ownerSeller.products.map((item) =>
        item.id === product.id ? { ...item, likes: item.likes + 1 } : item
      );

      const updatedSeller = {
        ...ownerSeller,
        products: updatedProducts,
      };

      await handleUpdateSeller(updatedSeller);
      setSellers(
        sellers.map((s) => (s.id === updatedSeller.id ? updatedSeller : s))
      );
    } catch (error) {
      console.error("Failed to update likes:", error);
    }
  };

  const handleNewComment = (product: Product, value: string) => {
    setNewComments((prev) => ({
      ...prev,
      [product.id]: value,
    }));
  };

  const handleAddComment = async (product: Product) => {
    const ownerSeller = sellers.find(
      (seller) => seller.id === product.sellerId
    );
    if (!ownerSeller || !newComments[product.id]?.trim()) return;

    try {
      const updatedProducts = ownerSeller.products.map((item) => {
        if (item.id === product.id) {
          const newComment: Comment = {
            date: new Date().toISOString(),
            author: sessionSeller.name,
            content: newComments[product.id].trim(),
          };

          return {
            ...item,
            comments: [...item.comments, newComment],
          };
        }
        return item;
      });

      const updatedSeller = {
        ...ownerSeller,
        products: updatedProducts,
      };

      await handleUpdateSeller(updatedSeller);
      setSellers(
        sellers.map((s) => (s.id === updatedSeller.id ? updatedSeller : s))
      );

      setNewComments((prev) => ({
        ...prev,
        [product.id]: "",
      }));
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleReviewSubmit = async (review: Review) => {
    const productOwner = sellers.find(
      (seller) => seller.id === product.sellerId
    );
    if (!productOwner) return;

    const updatedReviews = [...productOwner.reviews, review];
    // Create new notification for product sale
    const newNotification: SellerNotification = {
      id: crypto.randomUUID(),
      message: `Your product "${product.name}" has been sold to ${sessionSeller.name}`,
      typeOfNotification: "SALE",
    };

    const updatedProducts = productOwner.products.map((item) =>
      item.id === product.id
        ? {
            ...product,
            state: "SOLD",
          }
        : item
    );

    const updatedSeller = {
      ...productOwner,
      reviews: updatedReviews,
      products: updatedProducts,
      notifications: [
        ...(productOwner.notifications || []),
        newNotification,
      ],
    };

    try {
      await handleUpdateSeller(updatedSeller);
      setSellers(
        sellers.map((s) => (s.id === updatedSeller.id ? updatedSeller : s))
      );
    } catch (error) {
      console.error("Failed to send the review to the seller:", error);
    }
  };

  return (
    <>
      <SellerReviewDialog
        isOpen={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
        onSubmitReview={handleReviewSubmit}
        sellerName={owner?.name}
      />
      
      <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Seller Location</DialogTitle>
          </DialogHeader>
          {owner?.address && <LocationMap address={owner.address} />}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsLocationDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card key={product.id} className="flex flex-col w-72">
        <CardHeader>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <CardTitle className="mt-2">{product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <Badge
              variant={product.state === "AVAILABLE" ? "default" : "secondary"}
            >
              {product.state}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {format(new Date(product.publicationDate), "MMM dd, yyyy")}
            </span>
          </div>
          <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">{product.category}</p>
          {owner && (
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm font-medium">
                Seller: {owner.name + " " + owner.lastName}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLocationDialogOpen(true)}
              >
                <MapPin className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col mt-auto">
          <div className="flex justify-between items-center w-full mb-2">
            <div className="flex">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleLike(product)}
              >
                <Heart className="w-4 h-4 mr-2" />
                {product.likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleComments(product.id)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {product.comments.length}
              </Button>
            </div>
            <Dialog open={isBuyDialogOpen} onOpenChange={setIsBuyDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  onClick={() => setIsBuyDialogOpen(true)}
                >
                  Buy
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Action</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to buy this product?</p>
                <DialogFooter>
                  <Button
                    variant="secondary"
                    onClick={() => setIsBuyDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => {
                      setIsBuyDialogOpen(false);
                      setIsReviewDialogOpen(true);
                    }}
                  >
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div
            className={`w-full transition-all duration-300 ease-in-out ${
              displayComments[product.id] ? "h-[220px]" : "h-0"
            } overflow-hidden`}
          >
            {displayComments[product.id] && (
              <div className="h-full flex flex-col">
                <ScrollArea className="flex-1 mb-4">
                  {product.comments.map((comment) => (
                    <div
                      key={`${product.id}-${comment.date}`}
                      className="mb-4 p-2 bg-muted rounded-md"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-semibold">
                          {comment.author}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(comment.date), "MMM dd, yyyy")}
                        </p>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  ))}
                </ScrollArea>
                <div className="flex w-full mt-auto">
                  <Input
                    value={newComments[product.id] || ""}
                    onChange={(e) => handleNewComment(product, e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-grow mr-2"
                  />
                  <Button onClick={() => handleAddComment(product)} size="sm">
                    Send
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
