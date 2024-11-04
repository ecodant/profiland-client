import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Review } from "@/lib/types";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Star } from "lucide-react";

export const renderStars = (rating: number) => {
  return Array(5)
    .fill(0)
    .map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
};

export const renderReviews = (reviews: Review[], title: string) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[300px]">
        {reviews.map((review, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <div className="flex items-center mb-2">
              {renderStars(review.calification)}
              <span className="ml-2 text-sm text-gray-600">
                ({review.calification}/5)
              </span>
            </div>
            <p className="text-sm">{review.comment}</p>
            <p className="text-xs text-gray-500 mt-1">
              By: {review.authorName}
            </p>
          </div>
        ))}
      </ScrollArea>
    </CardContent>
  </Card>
);
