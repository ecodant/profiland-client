import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Heart, MessageCircle } from "lucide-react";
import { Product } from "@/lib/types";
import { useProducts } from "@/components/customHooks/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, parseISO } from "date-fns";
import ProductFormDialog from "./ProductFormDialog";

interface ProductProps {
  product: Product;
}

export default function AvailableProductCard({ product }: ProductProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [productToEdit, setProductToEdit] = useState<Product | null>(null)
  const [newComment, setNewComment] = useState("");
  const [commentDisplay, setCommentDisplay] = useState(false);
  const { handleDeleteProduct, addComment } = useProducts();

  const handleEditClick = () => {
    // setProductToEdit(product)
    setIsDialogOpen(true);
  };

  return (
    <>
      <ProductFormDialog
        product={product}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        // setProductToEdit={setProductToEdit}
      />

      <Card key={product.id} className="flex flex-col w-72">
        <CardHeader className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 p-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditClick}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <CardTitle className="mt-2">{product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <Badge
              variant={product.state === "AVAILABLE" ? "default" : "secondary"}
            >
              {product.state}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(parseISO(product.publicationDate), {
                addSuffix: true,
              })}
            </span>
          </div>
          <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">{product.category}</p>
        </CardContent>
        <CardFooter className="flex flex-col mt-auto">
          <div className="flex justify-between items-center w-full mb-2">
            <div className="">
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                {product.likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCommentDisplay(!commentDisplay)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {product.comments.length}
              </Button>
            </div>
            <Button>POST</Button>
          </div>
          {commentDisplay && (
            <>
              <ScrollArea className="h-48 w-full mb-4">
                {product.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="mb-4 p-2 bg-muted rounded-md"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-semibold">{comment.author}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(parseISO(comment.date), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))}
              </ScrollArea>
              <div className="flex w-full">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-grow mr-2"
                />
                <Button
                  onClick={() => addComment(product.id, newComment)}
                  size="sm"
                >
                  Send
                </Button>
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
