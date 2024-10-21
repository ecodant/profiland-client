import { useState, useEffect } from 'react'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { Heart, MessageCircle, MoreVertical, Send } from 'lucide-react'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getAllProducts, updateProduct, deleteProduct } from '@/services/productService'
import { Product , Comment} from '@/lib/types'



export default function ProductSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeComments, setActiveComments] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await getAllProducts()
      setProducts(fetchedProducts)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsDialogOpen(true)
  }

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId)
      setProducts(products.filter(p => p.id !== productId))
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  const handleUpdate = async (updatedProduct: Product) => {
    try {
      const updated = await updateProduct(updatedProduct.id, updatedProduct)
      setProducts(products.map(p => p.id === updated.id ? updated : p))
      setIsDialogOpen(false)
      setEditingProduct(null)
    } catch (error) {
      console.error('Failed to update product:', error)
    }
  }

  const toggleComments = (productId: string) => {
    setActiveComments(activeComments === productId ? null : productId)
  }

  const handleCommentSubmit = async (productId: string) => {
    if (!newComment.trim()) return

    const productToUpdate = products.find(p => p.id === productId)
    if (!productToUpdate) return

    const newCommentObj: Comment = {
      id: Date.now().toString(), // Generate a temporary ID
      date: new Date().toISOString(),
      author: 'Current User', // Replace with actual user name or ID
      content: newComment.trim()
    }

    const updatedComments: Comment[] = [...productToUpdate.comments, newCommentObj]

    try {
      const updatedProduct = await updateProduct(productId, {
        ...productToUpdate,
        comments: updatedComments
      })
      setProducts(products.map(p => p.id === productId ? updatedProduct : p))
      setNewComment('')
    } catch (error) {
      console.error('Failed to add comment:', error)
    }
  }

  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Marketplace Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="absolute top-2 right-2 h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(product)}>Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(product.id)}>Delete</DropdownMenuItem>
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
                <Badge variant={product.state === 'AVAILABLE' ? 'default' : 'secondary'}>
                  {product.state}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(parseISO(product.publicationDate), { addSuffix: true })}
                </span>
              </div>
              <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">{product.category}</p>
            </CardContent>
            <CardFooter className="flex flex-col mt-auto">
              <div className="flex justify-between items-center w-full mb-2">
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  {product.likes}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toggleComments(product.id)}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {product.comments.length}
                </Button>
              </div>
              {activeComments === product.id && (
                <>
                  <ScrollArea className="h-48 w-full mb-4">
                    {product.comments.map((comment) => (
                      <div key={comment.id} className="mb-4 p-2 bg-muted rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-semibold">{comment.author}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(parseISO(comment.date), { addSuffix: true })}
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
                    <Button onClick={() => handleCommentSubmit(product.id)} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <form onSubmit={(e) => {
              e.preventDefault()
              handleUpdate(editingProduct)
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">Category</Label>
                  <Input
                    id="category"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="state" className="text-right">State</Label>
                  <Input
                    id="state"
                    value={editingProduct.state}
                    onChange={(e) => setEditingProduct({...editingProduct, state: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right">Image URL</Label>
                  <Input
                    id="image"
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className='bg-blue-600'>Save changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}