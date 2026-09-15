import {
  mockBorrowRequests,
  mockReturnRecords,
  type BorrowRequest,
  type EquipmentRecord,
  type ReturnRecord,
  type UserRecord,
  mockEquipment,
  mockUsers,
} from "./mockData";

const keys = {
  requests: "borrowdesk-mock-requests",
  returns: "borrowdesk-mock-returns",
  equipment: "borrowdesk-mock-equipment",
  users: "borrowdesk-mock-users",
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getBorrowRequests() {
  return read<BorrowRequest[]>(keys.requests, mockBorrowRequests);
}

export function addBorrowRequest(request: BorrowRequest) {
  const requests = getBorrowRequests();
  write(keys.requests, [request, ...requests]);
  return request;
}

export function updateBorrowRequest(
  id: string,
  status: BorrowRequest["status"],
) {
  const requests = getBorrowRequests().map((request) =>
    request.id === id ? { ...request, status } : request,
  );
  write(keys.requests, requests);
  return requests;
}

export function cancelBorrowRequest(id: string) {
  return updateBorrowRequest(id, "ยกเลิก");
}

export function getReturnRecords() {
  return read<ReturnRecord[]>(keys.returns, mockReturnRecords);
}

export function getEquipmentRecords() {
  return read<EquipmentRecord[]>(keys.equipment, mockEquipment);
}

export function saveEquipmentRecords(records: EquipmentRecord[]) {
  write(keys.equipment, records);
  return records;
}

export function getUserRecords() {
  return read<UserRecord[]>(keys.users, mockUsers);
}

export function saveUserRecords(records: UserRecord[]) {
  write(keys.users, records);
  return records;
}

export function completeReturn(
  id: string,
  condition: "สภาพปกติ" | "ชำรุด" | "สูญหาย",
  note: string,
) {
  const records = getReturnRecords().map((record) =>
    record.id === id
      ? { ...record, returnedDate: "วันนี้", status: "รับคืนแล้ว" as const }
      : record,
  );
  write(keys.returns, records);
  return { records, condition, note };
}

export function resetMockStore() {
  localStorage.removeItem(keys.requests);
  localStorage.removeItem(keys.returns);
}
