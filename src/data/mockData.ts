import type { AuthUser } from "../types";

export interface BorrowRequest {
  id: string;
  borrower: string;
  borrowedDate: string;
  dueDate: string;
  items: string;
  quantity: number;
  purpose?: string;
  status: "รออนุมัติ" | "อนุมัติแล้ว" | "ปฏิเสธ" | "ยกเลิก";
}

export interface ReturnRecord {
  id: string;
  borrower: string;
  equipment: string;
  borrowedDate: string;
  dueDate: string;
  returnedDate: string;
  status: "รอคืน" | "รับคืนแล้ว" | "เกินกำหนด";
  fine: string;
}

export interface EquipmentRecord {
  code: string;
  name: string;
  category: string;
  total: number;
  available: number;
  status: string;
  location: string;
}

export interface UserRecord {
  name: string;
  studentId: string;
  email: string;
  department: string;
  role: string;
  status: string;
  joined: string;
}

export const mockAuthProfiles: AuthUser[] = [
  {
    id: 4,
    name: "memm",
    email: "suparuek.mem@gmail.com",
    password: "123456",
    role: "ADMIN",
    studentId: "ST-MEMM-01",
    department: "เทคโนโลยีสารสนเทศ",
  },
  {
    id: 1,
    name: "สมชาย ใจดี",
    email: "somchai@campus.ac.th",
    role: "USER",
    studentId: "ST-65001",
    department: "วิศวกรรมไฟฟ้า",
  },
  {
    id: 2,
    name: "อรทัย พรหมมา",
    email: "orathai@campus.ac.th",
    role: "STAFF",
    studentId: "ST-STAFF-04",
    department: "งานพัสดุ",
  },
  {
    id: 3,
    name: "ผู้ดูแลระบบ",
    email: "admin@campus.ac.th",
    role: "ADMIN",
    department: "งานเทคโนโลยีสารสนเทศ",
  },
];

export const mockBorrowRequests: BorrowRequest[] = [
  {
    id: "BR-2026-0018",
    borrower: "สมชาย ใจดี",
    borrowedDate: "10 ก.ย. 2569",
    dueDate: "17 ก.ย. 2569",
    items: "Notebook Lenovo",
    quantity: 1,
    status: "รออนุมัติ",
  },
  {
    id: "BR-2026-0017",
    borrower: "สมหญิง ใจงาม",
    borrowedDate: "09 ก.ย. 2569",
    dueDate: "12 ก.ย. 2569",
    items: "Projector Epson",
    quantity: 1,
    status: "รออนุมัติ",
  },
  {
    id: "BR-2026-0016",
    borrower: "กิตติพงษ์ ทองดี",
    borrowedDate: "08 ก.ย. 2569",
    dueDate: "15 ก.ย. 2569",
    items: "Arduino UNO และ Sensor",
    quantity: 4,
    status: "อนุมัติแล้ว",
  },
  {
    id: "BR-2026-0015",
    borrower: "นภัสสร แสงทอง",
    borrowedDate: "07 ก.ย. 2569",
    dueDate: "10 ก.ย. 2569",
    items: "Multimeter",
    quantity: 2,
    status: "ปฏิเสธ",
  },
];

export const mockReturnRecords: ReturnRecord[] = [
  {
    id: "RT-2026-0089",
    borrower: "กิตติพงษ์ ทองดี",
    equipment: "Arduino UNO",
    borrowedDate: "01 ก.ย. 2569",
    dueDate: "08 ก.ย. 2569",
    returnedDate: "-",
    status: "รอคืน",
    fine: "฿0",
  },
  {
    id: "RT-2026-0088",
    borrower: "สมหญิง ใจงาม",
    equipment: "Projector Epson",
    borrowedDate: "28 ส.ค. 2569",
    dueDate: "04 ก.ย. 2569",
    returnedDate: "09 ก.ย. 2569",
    status: "เกินกำหนด",
    fine: "฿100",
  },
  {
    id: "RT-2026-0087",
    borrower: "นภัสสร แสงทอง",
    equipment: "Multimeter",
    borrowedDate: "25 ส.ค. 2569",
    dueDate: "01 ก.ย. 2569",
    returnedDate: "01 ก.ย. 2569",
    status: "รับคืนแล้ว",
    fine: "฿0",
  },
];

export const mockUsers: UserRecord[] = [
  {
    name: "memm",
    studentId: "ST-MEMM-01",
    email: "suparuek.mem@gmail.com",
    department: "เทคโนโลยีสารสนเทศ",
    role: "ผู้ดูแลระบบ",
    status: "ใช้งานอยู่",
    joined: "วันนี้",
  },
  {
    name: "สมชาย ใจดี",
    studentId: "ST-65001",
    email: "somchai@campus.ac.th",
    department: "วิศวกรรมไฟฟ้า",
    role: "นักเรียน",
    status: "ใช้งานอยู่",
    joined: "12 มิ.ย. 2565",
  },
  {
    name: "สมหญิง ใจงาม",
    studentId: "ST-65018",
    email: "somying@campus.ac.th",
    department: "วิทยาการคอมพิวเตอร์",
    role: "นักเรียน",
    status: "ใช้งานอยู่",
    joined: "15 มิ.ย. 2565",
  },
  {
    name: "กิตติพงษ์ ทองดี",
    studentId: "ST-64032",
    email: "kittipong@campus.ac.th",
    department: "วิศวกรรมเครื่องกล",
    role: "นักเรียน",
    status: "ถูกระงับ",
    joined: "02 ก.ค. 2564",
  },
  {
    name: "อรทัย พรหมมา",
    studentId: "ST-STAFF-04",
    email: "orathai@campus.ac.th",
    department: "งานพัสดุ",
    role: "เจ้าหน้าที่",
    status: "ใช้งานอยู่",
    joined: "10 พ.ค. 2563",
  },
];

export const mockEquipment: EquipmentRecord[] = [
  {
    code: "EQ-NT-001",
    name: "Notebook Lenovo",
    category: "คอมพิวเตอร์",
    total: 12,
    available: 8,
    status: "พร้อมใช้งาน",
    location: "อาคาร A ชั้น 2",
  },
  {
    code: "EQ-PR-004",
    name: "Projector Epson",
    category: "โสตทัศนูปกรณ์",
    total: 6,
    available: 2,
    status: "พร้อมใช้งาน",
    location: "อาคาร B ชั้น 1",
  },
  {
    code: "EQ-AR-012",
    name: "Arduino UNO",
    category: "อุปกรณ์อิเล็กทรอนิกส์",
    total: 30,
    available: 24,
    status: "พร้อมใช้งาน",
    location: "ห้องปฏิบัติการ 1",
  },
  {
    code: "EQ-MM-008",
    name: "Multimeter",
    category: "เครื่องมือวัด",
    total: 10,
    available: 0,
    status: "กำลังซ่อม",
    location: "ห้องปฏิบัติการ 2",
  },
];

export const mockRooms = [
  {
    code: "LAB-101",
    name: "ห้องปฏิบัติการคอมพิวเตอร์ 1",
    building: "อาคาร A",
    floor: "1",
    capacity: 40,
    status: "พร้อมใช้งาน",
  },
  {
    code: "LAB-202",
    name: "ห้องปฏิบัติการคอมพิวเตอร์ 2",
    building: "อาคาร A",
    floor: "2",
    capacity: 35,
    status: "พร้อมใช้งาน",
  },
  {
    code: "MT-301",
    name: "ห้องประชุม 1",
    building: "อาคารกลาง",
    floor: "3",
    capacity: 20,
    status: "ปิดปรับปรุง",
  },
];
