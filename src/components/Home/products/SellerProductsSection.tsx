import { useState } from "react";
import ProductFormDialog from "./ProductFormDialog";
import { useProducts } from "@/components/customHooks/hooks";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import SellerProductCard from "./SellerProductCard";

export default function SellerProductSection() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { products } = useProducts();

  return (
    <div className="flex flex-col space-y-4 py-4">
      {isAddDialogOpen && (
        <ProductFormDialog
          setIsDialogOpen={setIsAddDialogOpen}
          isDialogOpen={isAddDialogOpen}
        />
      )}
      <Button
        className="w-12"
        onClick={() => {
          isAddDialogOpen
            ? setIsAddDialogOpen(false)
            : setIsAddDialogOpen(true);
        }}
      >
        <Plus />
      </Button>
      <div className="flex flex-row space-x-4">
        {products.map((product) => (
          <SellerProductCard key={product.id} product={product} />
        ))}
        {/* {products.map(product => ( <AvailableProductCard key={product.id} product={product} />)} */}
      </div>
    </div>
  );
}
