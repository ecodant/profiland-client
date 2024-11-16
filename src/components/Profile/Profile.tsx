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
import { Card, CardContent } from "../ui/card";
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

export default function Profile() {
  const [activeTab, setActiveTab] = useState("reviews");
  const { sessionSeller, sellers } = useSellers();
  const [reviewsGiven, setReviewsGiven] = useState<Review[]>([]);

  useEffect(() => {
    if (!sessionSeller || !sellers) return;

    const givenReviews = sellers
      .flatMap((seller) => seller.reviews)
      .filter((review) => review.authorId === sessionSeller.id);

    setReviewsGiven(givenReviews);
  }, [sellers, sessionSeller]);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flex items-start">
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
            <Badge className="mt-2">{sessionSeller.license}</Badge>
            <p className="text-sm text-gray-600 mt-2">{sessionSeller.address}</p>
          </div>
        </div>

        <Card className="w-full">
          <CardContent className="pt-6">
            <LocationMap address={sessionSeller.address != null ? sessionSeller.address : "Armenia-Quindio"} />
          </CardContent>
        </Card>
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