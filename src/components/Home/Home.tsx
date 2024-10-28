import { useState } from "react";
import Navbar from "../Header/NavBar";
import ContentSection from "./ContentSection";
import FriendSuggestions from "../FriendSection/FriendSuggestions";
import { Seller } from "@/lib/types";
interface HomeProps {
    sellerData: Seller | null
}
export default function Home({ sellerData }: HomeProps) {
    const [activeTab, setActiveTab] = useState('add');

    return (
        <div className="flex flex-col">
            <Navbar />
            <div className="flex flex-row justify-center w-full space-x-20 px-8 bg-emerald-300">
                <ContentSection seller={sellerData} activeTab={activeTab} setActiveTab={setActiveTab} />
                {/* <FriendSuggestions/> */}
            </div>

        </div>
    )
}