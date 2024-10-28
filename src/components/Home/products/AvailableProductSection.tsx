import { useState } from "react";
import AvailableProductCard from "./AvailableProductCard";
import ProductFormDialog from "./ProductFormDialog";
import { useProducts } from "@/components/customHooks/hooks";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AvailableProductContent() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { products } = useProducts();
  // const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  // // const [isDialogOpen, setIsDialogOpen] = useState(false)
  // // const [activeComments, setActiveComments] = useState<string | null>(null)
  // const [newComment, setNewComment] = useState('')

  // //CRUD OPERATIONS BRO

  // const handleEdit = (product: Product) => {
  //     setEditingProduct(product)
  //     setIsDialogOpen(true)
  // }

  // const handleDelete = async (productId: string) => {
  //     try {
  //         await deleteProduct(productId)
  //         setProducts(products.filter(p => p.id !== productId))
  //     } catch (error) {
  //         console.error('Failed to delete product:', error)
  //     }
  // }

  // const handleUpdate = async (updatedProduct: Product) => {
  //     try {
  //         const updated = await updateProduct(updatedProduct.id, updatedProduct)
  //         setProducts(products.map(p => p.id === updated.id ? updated : p))
  //         setIsDialogOpen(false)
  //         setEditingProduct(null)
  //     } catch (error) {
  //         console.error('Failed to update product:', error)
  //     }
  // }

  // //FOR THE COMMENTS

  // const handleCommentSubmit = async (productId: string) => {
  //     if (!newComment.trim()) return

  //     const productToUpdate = products.find(p => p.id === productId)
  //     if (!productToUpdate) return

  //     const newCommentObj: Comment = {
  //         id: Date.now().toString(), // Generate a temporary ID
  //         date: new Date().toISOString(),
  //         author: 'Current User', // Replace with actual user name or ID
  //         content: newComment.trim()
  //     }

  //     const updatedComments: Comment[] = [...productToUpdate.comments, newCommentObj]

  //     try {
  //         const updatedProduct = await updateProduct(productId, {
  //             ...productToUpdate,
  //             comments: updatedComments
  //         })
  //         setProducts(products.map(p => p.id === productId ? updatedProduct : p))
  //         setNewComment('')
  //     } catch (error) {
  //         console.error('Failed to add comment:', error)
  //     }
  // }

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
        {/* <ProductDialog editingProduct={editingProduct} setEditingProduct={setEditingProduct} onUpdateProduct={handleUpdate}
                    isEditDialogOpen={isDialogOpen} setEditDialogOpen={setIsDialogOpen} /> */}
        {products.map((product) => (
          <AvailableProductCard key={product.id} product={product} />
        ))}
        {/* {products.map(product => ( <AvailableProductCard key={product.id} product={product} />)} */}
      </div>
    </div>
  );
}
