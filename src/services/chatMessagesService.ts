import { ChatMessage } from "@/lib/types";
import api from "../services/api";

export async function getAllMessages(): Promise<ChatMessage[]> {
  const response = await api.get("/profiland/chatmessages/");
  return response.data;
}


