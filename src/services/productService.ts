import { Product } from "@/lib/types";
import api from "../services/api";

export async function getAllProducts(): Promise<Product[]> {
  const response = await api.get("/profiland/products/");
  return response.data;
}

export async function getProductById(id: string): Promise<Product> {
  const response = await api.get(`/profiland/products/${id}`);
  return response.data;
}

export async function createProduct(productData: Product): Promise<Product> {
  const response = await api.post("/profiland/products/", productData);
  return response.data;
}

export async function updateProduct(
  id: string,
  productData: Product
): Promise<Product> {
  const response = await api.put(`/profiland/products/${id}`, productData);
  console.log(response.data);
  return response.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/profiland/products/${id}`);
}

// export async function uploadProductImage(
//   id: string,
//   image: File
// ): Promise<Product> {
//   const formData = new FormData();
//   formData.append("image", image);

//   const response = await api.post(`/profiland/products/${id}/image`, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return response.data;
// }
