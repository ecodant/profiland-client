import React, { useCallback, useEffect, useState } from 'react';
import { over, Client } from 'stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '@/lib/types';
import { useSellers } from '@/hooks/hooks';
import { getAllMessages } from '@/services/chatMessagesService';

interface UserData {
  username: string;
  receivername: string;
  connected: boolean;
  message: string;
}

let stompClient: Client | null = null;

export default function SellerChat() {
  const [privateChats, setPrivateChats] = useState<Map<string, ChatMessage[]>>(new Map());
  const [publicChats, setPublicChats] = useState<ChatMessage[]>([]);
  const [tab, setTab] = useState<string>("CHATROOM");
  const { sessionSeller } = useSellers();
  const [userData, setUserData] = useState<UserData>({
    username: sessionSeller.name, // Initialize with sessionSeller.name
    receivername: '',
    connected: false,
    message: ''
  });

  const fetchHistoryMessages = useCallback(async () => {
    try {
      // Fetch the messages from the server
      const fetchedMessages: ChatMessage[] = await getAllMessages();
  
      // Organize messages into the privateChats Map
      const chatMap = new Map<string, ChatMessage[]>();
  
      fetchedMessages.forEach((message) => {
        // Determine the chat participant: the other user in a private chat
        let chatParticipant = message.senderName === sessionSeller.name
          ? message.receiverName
          : message.senderName;
  
        // If chatParticipant is null or the message is public, skip
        if (!chatParticipant) return;
  
        // Initialize the message list for this chat participant if not already present
        if (!chatMap.has(chatParticipant)) {
          chatMap.set(chatParticipant, []);
        }
  
        // Append the current message to the correct chat participant's list
        chatMap.get(chatParticipant)?.push(message);
      });
      console.log(chatMap)
      // Update the privateChats state
      setPrivateChats(chatMap);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  }, [sessionSeller.name]);
  
  useEffect(() => {
    const initializeConnection = async () => {
      connect();
      await fetchHistoryMessages(); // Correctly await the function
    };
    
    initializeConnection();
  }, [fetchHistoryMessages]); // Include fetchHistoryMessages as a dependency
  
  const connect = (): void => {
    let Sock = new SockJS('http://192.168.1.35:8080/ws');
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = (): void => {
    setUserData(prev => ({ ...prev, connected: true }));
    if (stompClient) {
      stompClient.subscribe('/chatroom/public', onMessageReceived);
      stompClient.subscribe(`/user/${sessionSeller.name}/private`, onPrivateMessage);
      userJoin();
    }
  };

  // Rest of the component remains the same...
  const userJoin = (): void => {
    const chatMessage: ChatMessage = {
      senderName: sessionSeller.name,
      timestamp: new Date().toISOString(),
      status: "JOIN"
    };
    if (stompClient) {
      // Send the join message to the public chatroom
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }
  };
  

  const onMessageReceived = (payload: { body: string }): void => {
    const payloadData: ChatMessage = JSON.parse(payload.body);
  
    switch (payloadData.status) {
      case "JOIN":
        // Check if the user is already in the privateChats Map
        if (!privateChats.get(payloadData.senderName)) {
          privateChats.set(payloadData.senderName, []);
          setPrivateChats(new Map(privateChats));
        }
        break;
      case "MESSAGE":
        setPublicChats(prev => [...prev, payloadData]);
        break;
    }
  };
  

  const onPrivateMessage = (payload: { body: string }): void => {
    const payloadData: ChatMessage = JSON.parse(payload.body);
    
    setPrivateChats(prev => {
      const newMap = new Map(prev);
      const existingMessages = newMap.get(payloadData.senderName) || [];
      newMap.set(payloadData.senderName, [...existingMessages, payloadData]);
      return newMap;
    });
  };

  const onError = (err: any): void => {
    console.log('Error:', err);
  };

  const handleMessage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    setUserData(prev => ({ ...prev, message: value }));
  };

  const sendValue = (): void => {
    if (stompClient && userData.message.trim()) {
      const chatMessage: ChatMessage = {
        senderName: sessionSeller.name,
        timestamp: new Date().toISOString(),
        message: userData.message,
        status: "MESSAGE"
      };
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
      setUserData(prev => ({ ...prev, message: "" }));
    }
  };

  const sendPrivateValue = (): void => {
    if (stompClient && userData.message.trim()) {
      const chatMessage: ChatMessage = {
        senderName: sessionSeller.name,
        timestamp: new Date().toISOString(),
        receiverName: tab,
        message: userData.message,
        status: "MESSAGE"
      };

      if (sessionSeller.name !== tab) {
        const chatList = privateChats.get(tab) || [];
        chatList.push(chatMessage);
        setPrivateChats(new Map(privateChats.set(tab, chatList)));
      }
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setUserData(prev => ({ ...prev, message: "" }));
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      tab === "CHATROOM" ? sendValue() : sendPrivateValue();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
            </div>
            <div className="overflow-y-auto h-full">
              <div 
                onClick={() => setTab("CHATROOM")} 
                className={`p-3 cursor-pointer hover:bg-gray-100 transition-colors ${
                  tab === "CHATROOM" ? "bg-blue-50 border-l-4 border-primary" : ""
                }`}
              >
                <span className="font-medium text-gray-800">Public Chat</span>
              </div>
              {Array.from(privateChats.keys()).filter(name => name !== sessionSeller.name).map((name, index) => (
                <div 
                  key={index}
                  onClick={() => setTab(name)} 
                  className={`p-3 cursor-pointer hover:bg-gray-100 transition-colors ${
                    tab === name ? "bg-blue-50 border-l-4 border-primary" : ""
                  }`}
                >
                  <span className="font-medium text-gray-800">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {tab === "CHATROOM" ? "Public Chat" : `Chat with ${tab}`}
              </h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {(tab === "CHATROOM" ? publicChats : privateChats.get(tab) || []).map((chat, index) => (
                <div
                  key={index}
                  className={`flex ${chat.senderName === sessionSeller.name ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${chat.senderName === sessionSeller.name ? 'order-2' : ''}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      {chat.senderName !== sessionSeller.name && (
                        <span className="text-sm text-gray-600">{chat.senderName}</span>
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        chat.senderName === sessionSeller.name
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {chat.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={userData.message}
                  onChange={handleMessage}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  onClick={tab === "CHATROOM" ? sendValue : sendPrivateValue}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-primary focus:ring-offset-2"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}