import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useSellers } from "@/hooks/hooks";
import { Seller } from "@/lib/types";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useState, useEffect } from "react";

export const renderContacts = () => {
  const { sessionSeller, sellers } = useSellers();

  const [sessionContacts, setSessionContacts] = useState<Seller[]>([]);

  useEffect(() => {
    // Only proceed if we have a valid session seller
    if (!sessionSeller) return;

    const contactsOfTheSession = sellers.filter((seller) => {
      // Skip the current logged-in user
      if (seller.id === sessionSeller.id) return false;

      // Check if the seller its in the contacts list of the session
      const isAlreadyContact = sessionSeller.contacts.includes(seller.id);
      if (isAlreadyContact) return true;

      return false;
    });

    setSessionContacts(contactsOfTheSession);
  }, [sellers, sessionSeller]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts</CardTitle>
        <CardDescription>{sessionContacts.length} contacts</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {sessionContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center mb-2 p-2 border rounded"
            >
              {/* <Avatar className="mr-2">
                <AvatarImage src={`${contact.profileImg}`} />
                <AvatarFallback>{contact.name[0]}</AvatarFallback>
              </Avatar> */}
              <div>
                <p className="font-medium">
                  {contact.name} {contact.lastName}
                </p>
                <p className="text-sm text-gray-500">{contact.email}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
