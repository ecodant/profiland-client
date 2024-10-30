import { ContactRequest } from "@/lib/types";
import api from "./api";

export async function getAllRequests(): Promise<ContactRequest[]> {
  const response = await api.get("/profiland/contact-requests/");
  return response.data;
}

export async function getRequestByid(id: string): Promise<ContactRequest> {
  const response = await api.get(`/profiland/contact-requests/${id}`);
  return response.data;
}

export async function createRequest(data: ContactRequest): Promise<boolean> {
  const response = await api.post("/profiland/contact-requests/", data);
  if (response.status == 200) return true;
  else return false;
}

export async function rejectRequest(id: string): Promise<boolean> {
  const response = await api.put(`/profiland/contact-requests/${id}/reject`);
  if (response.status == 200) return true;
  else return false;
}

export async function acceptRequest(id: string): Promise<boolean> {
  const response = await api.put(`/profiland/contact-requests/${id}/accept`);
  if (response.status == 200) return true;
  else return false;
}

export async function updateProduct(
  id: string,
  data: ContactRequest
): Promise<ContactRequest> {
  const response = await api.put(`/profiland/contact-requests/${id}`, data);
  console.log(response.data);
  return response.data;
}
