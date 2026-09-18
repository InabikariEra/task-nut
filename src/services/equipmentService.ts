import type { EquipmentRecord } from "../data/mockData";
import { api } from "./api";

export async function getEquipmentRequest() {
  const response = await api.get<EquipmentRecord[]>("/catalog/items");
  return response.data;
}

export async function createEquipmentRequest(payload: unknown) {
  const response = await api.post("/admin/items", payload);
  return response.data;
}

export async function updateEquipmentRequest(id: number, payload: unknown) {
  const response = await api.put(`/admin/items/${id}`, payload);
  return response.data;
}

export async function deleteEquipmentRequest(id: number) {
  await api.delete(`/admin/items/${id}`);
}
