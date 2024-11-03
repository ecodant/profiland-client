import {
  Bell,
  LogOut,
  MessageSquare,
  User,
  Check,
  X,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSellers } from "@/hooks/hooks";
import { SellerNotification } from "@/lib/types";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { sessionSeller, handleUpdateSeller, sellers, setSellers } =
    useSellers();
  const navigate = useNavigate();

  const handleDeleteNotification = async (notification: SellerNotification) => {
    try {
      const updatedNotifications = sessionSeller.notifications.filter(
        (n) => n.id !== notification.id
      );

      const updatedSessionSeller = {
        ...sessionSeller,
        notifications: updatedNotifications,
      };

      await handleUpdateSeller(updatedSessionSeller);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleRequestResponse = async (
    accepted: boolean,
    notification: SellerNotification
  ) => {
    try {
      const contactRequest = sessionSeller.contactRequests.find(
        (request) => request.id === notification.id
      );

      if (!contactRequest) {
        console.error("No matching contact request found");
        return;
      }

      const updatedContactRequests = sessionSeller.contactRequests.map(
        (request) =>
          request.id === notification.id
            ? { ...request, state: accepted ? "ACCEPTED" : "REJECTED" }
            : request
      );

      const updatedNotifications = sessionSeller.notifications.filter(
        (n) => n.id !== notification.id
      );

      const updatedContacts = accepted
        ? [...sessionSeller.contacts, contactRequest.idEmisor]
        : sessionSeller.contacts;

      const updatedSessionSeller = {
        ...sessionSeller,
        contactRequests: updatedContactRequests,
        notifications: updatedNotifications,
        contacts: updatedContacts,
      };

      if (accepted) {
        const senderSeller = sellers.find(
          (seller) => seller.id === contactRequest.idEmisor
        );

        if (senderSeller) {
          const newNotification: SellerNotification = {
            id: senderSeller.id,
            message: `${sessionSeller.name} has accepted your request, he's in your network now.`,
            typeOfNotification: "INFO",
          };

          const updatedSenderSeller = {
            ...senderSeller,
            contacts: [...senderSeller.contacts, sessionSeller.id],
            notifications: [
              ...(senderSeller.notifications || []),
              newNotification,
            ],
          };

          await handleUpdateSeller(updatedSenderSeller);

          setSellers((prevSellers) =>
            prevSellers.map((seller) =>
              seller.id === senderSeller.id ? updatedSenderSeller : seller
            )
          );
        }
      }

      await handleUpdateSeller(updatedSessionSeller);
    } catch (error) {
      console.error("Error handling contact request:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInSeller");
    window.location.reload();
    // navigate("/auth");
  };

  return (
    <nav className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <span className="font-bold text-xl">PROFILAND</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/chats")}
            >
              <MessageSquare className="h-5 w-5" />
              <span className="sr-only">Chats</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {sessionSeller.notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {sessionSeller.notifications.length}
                    </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                {sessionSeller.notifications.length === 0 ? (
                  <DropdownMenuItem className="text-center text-muted-foreground">
                    No notifications
                  </DropdownMenuItem>
                ) : (
                  sessionSeller.notifications.map((notification, index) => (
                    <DropdownMenuItem
                      key={`${sessionSeller.id}-${index}`}
                      className="flex items-center justify-between p-4"
                    >
                      <span className="flex-1">{notification.message}</span>
                      {notification.typeOfNotification === "REQUEST" ? (
                        <div className="flex gap-2 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-green-100"
                            onClick={() =>
                              handleRequestResponse(true, notification)
                            }
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-red-100"
                            onClick={() =>
                              handleRequestResponse(false, notification)
                            }
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                          onClick={() => handleDeleteNotification(notification)}
                        >
                          <Trash2 className="h-4 w-4 text-gray-600" />
                        </Button>
                      )}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="h-4 w-4 mr-2" />
                  {sessionSeller.name + " profile's"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
