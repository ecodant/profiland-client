import { LoginFormValues, Seller, SellerSchema } from "@/lib/types";
import api from "./api";
import { z } from "zod";

// Seller service function
export async function registerSeller(sellerData: Seller, format: string = 'dat'): Promise<Seller> {
  const response = await api.post('/profiland/sellers/register', sellerData, {
    params: { format }
  });
  return SellerSchema.parse(response.data);
}

export async function loginSeller(credentials: LoginFormValues): Promise<Seller> {
  const response = await api.post('/profiland/sellers/login', credentials);
  if (response.status !== 200) {
      throw new Error('Invalid credentials'); 
  }
  return SellerSchema.parse(response.data);
}

export async function getAllSellers(): Promise<Seller[]> {
  const response = await api.get('/profiland/sellers/');
  // Parse the JSON string response
  const sellers = JSON.parse(response.data);
  return z.array(SellerSchema).parse(sellers);
}

export async function getSellerById(id: string): Promise<Seller> {
  const response = await api.get(`/profiland/sellers/${id}`);
  return SellerSchema.parse(response.data);
}

export async function getSellersByName(name: string): Promise<Seller[]> {
  const response = await api.get(`/profiland/sellers/name/${name}`);
  return z.array(SellerSchema).parse(response.data);
}

export async function updateSeller(
  id: string, 
  sellerData: Partial<Omit<Seller, 'id'>>,
  format: string = 'dat'
): Promise<Seller> {
  const response = await api.put(
    `/profiland/sellers/${id}`, 
    sellerData,
    { params: { format } }
  );
  return SellerSchema.parse(response.data);
}

export async function deleteSeller(id: string): Promise<string> {
  const response = await api.delete(`/profiland/sellers/${id}`);
  return response.data;
}
