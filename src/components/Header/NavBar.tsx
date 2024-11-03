import {
  Bell,
  FileText,
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

export default function Navbar() {
  const { sessionSeller, handleUpdateSeller, sellers, setSellers } =
    useSellers();

  const handleDeleteNotification = async (notification: SellerNotification) => {
    try {
      // Filter out the notification to be deleted
      const updatedNotifications = sessionSeller.notifications.filter(
        (n) => n.id !== notification.id
      );

      // Update the session seller with the new notifications array
      const updatedSessionSeller = {
        ...sessionSeller,
        notifications: updatedNotifications,
      };

      // Update the session seller in the database
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
      // Find the corresponding contact request
      const contactRequest = sessionSeller.contactRequests.find(
        (request) => request.id === notification.id
      );

      if (!contactRequest) {
        console.error("No matching contact request found");
        return;
      }

      // Update contact request state based on response
      const updatedContactRequests = sessionSeller.contactRequests.map(
        (request) =>
          request.id === notification.id
            ? { ...request, state: accepted ? "ACCEPTED" : "REJECTED" }
            : request
      );

      // Filter out the current notification
      const updatedNotifications = sessionSeller.notifications.filter(
        (n) => n.id !== notification.id
      );

      // If accepted, add sender to contacts array
      const updatedContacts = accepted
        ? [...sessionSeller.contacts, contactRequest.idEmisor]
        : sessionSeller.contacts;

      // Update the session seller
      const updatedSessionSeller = {
        ...sessionSeller,
        contactRequests: updatedContactRequests,
        notifications: updatedNotifications,
        contacts: updatedContacts,
      };

      // If accepted, also update the sender's contacts to include the receiver
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

          // Update the sender in the database
          await handleUpdateSeller(updatedSenderSeller);

          // Update sellers list in state
          setSellers((prevSellers) =>
            prevSellers.map((seller) =>
              seller.id === senderSeller.id ? updatedSenderSeller : seller
            )
          );
        }
      }

      // Update the session seller in the database
      await handleUpdateSeller(updatedSessionSeller);
    } catch (error) {
      console.error("Error handling contact request:", error);
    }
  };

  return (
    <nav className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center">
            <span className="font-bold text-xl">PROFILAND</span>
          </a>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <a href="/generate-report">
                <FileText className="h-5 w-5" />
                <span className="sr-only">Generate Report</span>
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="/chats">
                <MessageSquare className="h-5 w-5" />
                <span className="sr-only">Chats</span>
              </a>
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
                <DropdownMenuItem asChild>
                  <a href="/profile">{sessionSeller.name + " profile's"}</a>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.removeItem("loggedInSeller");
                    window.location.reload();
                  }}
                >
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
