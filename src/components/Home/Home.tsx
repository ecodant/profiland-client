import { useState } from "react";
import Navbar from "../Header/NavBar";
import ContentSection from "./ContentSection";
import FriendSuggestions from "../FriendSection/FriendSuggestions";

export default function Home() {
  const [activeTab, setActiveTab] = useState("add");
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex flex-row justify-center w-full space-x-20 px-8">
        <ContentSection activeTab={activeTab} setActiveTab={setActiveTab} />
        <FriendSuggestions />
      </div>
    </div>
  );
}
