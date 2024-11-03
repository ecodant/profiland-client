import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useSellers } from "@/hooks/hooks";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export const renderProductDashboard = () => {
  const { sessionSeller, sellers } = useSellers();
  const soldProducts = sessionSeller.products.filter((p) => p.state === "SOLD");
  const availableProducts = sessionSeller.products.filter(
    (p) => p.state === "AVAILABLE"
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Sold Products</CardTitle>
          <CardDescription>{soldProducts.length} products sold</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {soldProducts.map((product) => (
              <div key={product.id} className="flex items-center mb-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded mr-2"
                />
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">${product.price}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Available Products</CardTitle>
          <CardDescription>
            {availableProducts.length} products available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {availableProducts.map((product) => (
              <div key={product.id} className="flex items-center mb-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded mr-2"
                />
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">${product.price}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
