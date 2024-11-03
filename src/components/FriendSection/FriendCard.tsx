import { Seller } from "@/lib/types";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface FriendCardProps {
  seller: Seller;
  onSendRequest: (id: string) => void;
}

export default function FriendCard({ seller, onSendRequest }: FriendCardProps) {
  return (
    <Card key={seller.id} className="overflow-hidden w-80">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <a
            href={`/profile/${seller.name}`}
            className="flex items-center space-x-4 flex-grow"
          >
            <Avatar>
              <AvatarImage
                src={seller.profileImg}
                alt={`${seller.name}'s avatar`}
              />
              <AvatarFallback>
                {seller.name[0] + seller.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{seller.name}</p>
              <p className="text-sm text-muted-foreground">@{seller.license}</p>
            </div>
          </a>
          <Button
            onClick={() => onSendRequest(seller.id)}
            size="sm"
            className="ml-4"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Sent Request
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
