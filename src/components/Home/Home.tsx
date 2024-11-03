import { useState } from "react";
import ContentSection from "./ContentSection";
import FriendSuggestions from "../FriendSection/FriendSuggestions";

export default function Home() {
  const [activeTab, setActiveTab] = useState("add");
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-center w-full space-x-20 px-8 space-y-4">
        <ContentSection activeTab={activeTab} setActiveTab={setActiveTab} />
        <FriendSuggestions />
      </div>
    </div>
  );
}
