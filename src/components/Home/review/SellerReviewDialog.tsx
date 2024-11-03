import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { Review } from "@/lib/types";
import { useSellers } from "@/hooks/hooks";

type SellerReviewDialogProps = {
  onSubmitReview: (review: Review) => void;
  sellerName?: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function SellerReviewDialog({
  onSubmitReview,
  sellerName,
  isOpen,
  onClose,
}: SellerReviewDialogProps) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { sessionSeller } = useSellers();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    onSubmitReview({
      authorRef: sessionSeller.id,
      comment,
      calification: rating,
    });
    onClose();
    setComment("");
    setRating(0);
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleRatingHover = (value: number) => {
    setHoveredRating(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate {sellerName}'s service</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Please tell us your opinion about the Seller
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review here..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((value) => (
                <Star
                  key={value}
                  className={`w-6 h-6 cursor-pointer ${
                    (hoveredRating || rating) >= value
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => handleRatingClick(value)}
                  onMouseEnter={() => handleRatingHover(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                />
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full">
            Submit Review
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
