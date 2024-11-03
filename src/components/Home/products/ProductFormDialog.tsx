import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Product, ProductInput, productInputSchema } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useSellers } from "@/hooks/hooks";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductFormDialogProps = {
  product?: Product | null;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  setProductToEdit?: React.Dispatch<React.SetStateAction<Product | null>>;
  onSubmitSuccess?: () => void;
};

export default function ProductFormDialog({
  product,
  isDialogOpen,
  setIsDialogOpen,
  setProductToEdit,
  onSubmitSuccess,
}: ProductFormDialogProps) {
  const isEditing = !!product;
  const { sessionSeller, handleUpdateSeller, setSessionSeller } = useSellers();

  const form = useForm<ProductInput>({
    resolver: zodResolver(productInputSchema),
    defaultValues: isEditing
      ? {
          name: product.name,
          code: product.code,
          image: product.image,
          category: product.category,
          price: product.price,
          state: product.state,
        }
      : {
          name: "",
          code: "",
          image: "",
          category: "",
          price: 0,
          state: "AVAILABLE",
        },
  });

  const handleSubmit = async (data: ProductInput) => {
    if (!sessionSeller) {
      console.error("No session seller found");
      return;
    }

    let updatedProducts: Product[];

    if (isEditing && product) {
      // Update existing product
      updatedProducts = sessionSeller.products.map((item) =>
        item.id === product.id
          ? {
              ...product,
              ...data,
              // Preserve the original fields that aren't in the form
              id: product.id,
              publicationDate: product.publicationDate,
              comments: product.comments,
              likes: product.likes,
              sellerId: product.sellerId,
            }
          : item
      );
    } else {
      // Create new product
      const newProduct: Product = {
        ...data,
        id: crypto.randomUUID(),
        publicationDate: new Date().toISOString(),
        comments: [],
        likes: 0,
        sellerId: sessionSeller.id,
      };

      updatedProducts = [...sessionSeller.products, newProduct];
    }

    // Create updated seller object
    const updatedSeller = {
      ...sessionSeller,
      products: updatedProducts,
    };

    try {
      // Update the seller data
      await handleUpdateSeller(updatedSeller);

      // Update local state only after successful API call
      setSessionSeller(updatedSeller);

      // Reset form and close dialog
      form.reset();
      setIsDialogOpen(false);

      // Clear product being edited if applicable
      if (setProductToEdit) {
        setProductToEdit(null);
      }

      // Call success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Failed to update seller:", error);
      // Here you might want to show an error message to the user
    }
  };

  // Rest of your component remains the same...
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Product code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Product category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
                      <SelectItem value="AVAILABLE">AVAILABLE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isEditing ? "Update Product" : "Create Product"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
