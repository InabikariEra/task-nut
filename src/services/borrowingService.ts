import { api } from "./api";

export async function getBorrowingsRequest() {
  const response = await api.get("/borrowings");
  return response.data;
}

export async function createBorrowingRequest(payload: unknown) {
  const response = await api.post("/borrowings", payload);
  return response.data;
}

export async function cancelBorrowingRequest(id: number) {
  const response = await api.patch(`/borrowings/${id}/cancel`);
  return response.data;
}
