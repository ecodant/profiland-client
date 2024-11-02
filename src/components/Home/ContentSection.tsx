import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import SellerProductsSection from "./products/SellerProductsSection";

interface TabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ContentSection({ activeTab, setActiveTab }: TabProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="add">Your Products</TabsTrigger>
        <TabsTrigger value="friends">Friends' Products</TabsTrigger>
      </TabsList>

      <TabsContent value="add">
        <SellerProductsSection />
      </TabsContent>

      <TabsContent value="friends">
        <div>Here are your friends' products.</div>
      </TabsContent>
    </Tabs>
  );
}
