import { renderContacts } from "./subsections/ContactsProfile";
import { renderProductDashboard } from "./subsections/ProductsProfile";
import { renderReviews } from "./subsections/ReviewsProfile";
import { reportsTab } from "./subsections/ReportsProfile";
import { useSellers } from "@/hooks/hooks";
import { useEffect, useState } from "react";
import { Review } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("reviews");
  const { sessionSeller, sellers } = useSellers();
  const [reviewsGiven, setReviewsGiven] = useState<Review[]>([]);

  useEffect(() => {
    if (!sessionSeller || !sellers) return;

    // Filter reviews given by the reviews in which the sessionSeller participes
    const givenReviews = sellers
      .flatMap((seller) => seller.reviews) // Access each seller's reviews
      .filter((review) => review.authorId === sessionSeller.id); // Filter reviews authored by session seller

    setReviewsGiven(givenReviews);
  }, [sellers, sessionSeller]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 flex items-center">
        <Avatar className="h-20 w-20 mr-4">
          <AvatarImage src={sessionSeller.profileImg} />
          <AvatarFallback>
            {sessionSeller.name[0]}
            {sessionSeller.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">
            {sessionSeller.name} {sessionSeller.lastName}
          </h1>
          <p className="text-gray-600">{sessionSeller.email}</p>
          <Badge>{sessionSeller.license}</Badge>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          {renderReviews(sessionSeller.reviews, "Reviews Received")}
          {renderReviews(reviewsGiven, "Reviews Given")}
        </TabsContent>

        <TabsContent value="products">{renderProductDashboard()}</TabsContent>
        <TabsContent value="contacts">{renderContacts()}</TabsContent>
        <TabsContent value="reports">{reportsTab()}</TabsContent>
      </Tabs>
    </div>
  );
}
