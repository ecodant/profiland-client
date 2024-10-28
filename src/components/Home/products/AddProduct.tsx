import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createProduct } from '@/services/productService'
import { ProductInput, productInputSchema, Product, Seller } from '@/lib/types'

interface AddProductProps {
  seller: Seller | null
}

export default function AddProduct({ seller }: AddProductProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<ProductInput>({
    resolver: zodResolver(productInputSchema),
    defaultValues: {
      name: '',
      code: '',
      image: '',
      category: '',
      price: 0,
      state: 'AVAILABLE',
    },
  })

  const onSubmit = async (data: ProductInput) => {
    try {
      const newProduct: Product = {
        ...data,
        id: '', // This will be assigned by the server
        publicationDate: new Date().toISOString(),
        comments: [],
        likes: 0,
        sellerId: seller != null ? seller.id : "",
      }
      const createdProduct = await createProduct(newProduct)

      console.log('Product created:', createdProduct)
      form.reset()
      setIsDialogOpen(false)
      // You might want to refresh the product list or show a success message here
    } catch (error) {
      console.error('Failed to create product:', error)
      // You might want to show an error message to the user here
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className='absolute top-[680px] bg-blue-600'>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Input placeholder="https://example.com/image.jpg" {...field} />
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
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-blue-600">Create Product</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}