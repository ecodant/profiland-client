import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Product, ProductInput, Seller, Comment } from "@/lib/types";
import { ProductsContext } from "../context/context";
import { useEffect, useState } from "react";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "@/services/productService";
import { useSellers } from "@/hooks/hooks";
import SellerProductsSection from "./products/SellerProductsSection";

interface TabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ContentSection({ activeTab, setActiveTab }: TabProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { sessionSeller } = useSellers();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await getAllProducts();
      const currentUserProducts = fetchedProducts.filter(
        (p) => p.sellerId === sessionSeller.id
      );
      setProducts(currentUserProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  // const fetchProducts = useCallback(async () => {
  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     const fetchedProducts = await getAllProducts();
  //     setProducts(fetchedProducts);
  //   } catch (err) {
  //     const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
  //     setError(errorMessage);
  //     console.error('Failed to fetch products:', err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

  const addProduct = async (data: ProductInput) => {
    try {
      const newProduct: Product = {
        ...data,
        id: "",
        publicationDate: new Date().toISOString(),
        comments: [],
        likes: 0,
        sellerId: sessionSeller != null ? sessionSeller.id : "",
      };
      const createdProduct = await createProduct(newProduct);
      setProducts([...products, createdProduct]);

      // console.log("Product created:", createdProduct);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      // console.log(updatedProduct);
      const updated = await updateProduct(updatedProduct.id, updatedProduct);
      updated
        ? console.log("Updating the thing")
        : console.log("No updating the thing");
      setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      setProducts(products.filter((p) => p.id !== productId));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const addComment = async (productId: string, comment: string) => {
    // if (!newComment.trim()) return

    const productToUpdate = products.find((p) => p.id === productId);
    if (!productToUpdate) return;

    const newCommentObj: Comment = {
      id: Date.now().toString(), // Generate a temporary ID
      date: new Date().toISOString(),
      author: sessionSeller.name + " " + sessionSeller.lastName, // Replace with actual user name or ID
      content: comment.trim(),
    };

    const updatedComments: Comment[] = [
      ...productToUpdate.comments,
      newCommentObj,
    ];

    try {
      const updatedProduct = await updateProduct(productId, {
        ...productToUpdate,
        comments: updatedComments,
      });
      setProducts(
        products.map((p) => (p.id === productId ? updatedProduct : p))
      );
      // setNewComment('')
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="add">Your Products</TabsTrigger>
        <TabsTrigger value="friends">Friends' Products</TabsTrigger>
      </TabsList>

      <TabsContent value="add">
        <ProductsContext.Provider
          value={{
            products,
            addProduct,
            handleUpdateProduct,
            handleDeleteProduct,
            addComment,
            isDialogOpen,
          }}
        >
          {/* <AddProduct seller={seller} /> */}
          <SellerProductsSection />
        </ProductsContext.Provider>
      </TabsContent>

      <TabsContent value="friends">
        <div>Here are your friends' products.</div>
      </TabsContent>
    </Tabs>
  );
}
