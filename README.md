# เทคโนโลยีที่ใช้ในโปรเจกต์

ระบบยืม-คืนอุปกรณ์การเรียนและห้องปฏิบัติการ พัฒนาด้วยเทคโนโลยี Full Stack โดยแบ่งออกเป็น Frontend, Backend, Database และ Authentication

## Client / Frontend

ใช้สำหรับพัฒนาหน้าเว็บและส่วนติดต่อผู้ใช้งาน

* **React 19** - พัฒนา UI และ Component
* **TypeScript** - จัดการโครงสร้างและ Type ของข้อมูล
* **Vite** - เครื่องมือสำหรับ Development และ Build
* **React Router** - จัดการ Routing และ Navigation
* **Tailwind CSS** - ออกแบบและตกแต่ง UI
* **Axios** - เชื่อมต่อกับ Backend API
* **Noto Sans Thai** - ฟอนต์สำหรับรองรับภาษาไทย
* **ESLint** - ตรวจสอบคุณภาพและรูปแบบของโค้ด

### Frontend ทำหน้าที่

* แสดงหน้าเว็บและ UI
* จัดการ Navigation
* แสดง Dashboard
* จัดการอุปกรณ์ หนังสือ ห้อง และค่าปรับ
* แสดงข้อมูลตาม Role ของผู้ใช้งาน
* เชื่อมต่อกับ Backend API
* รองรับ Mock Data สำหรับทดสอบ UI

---

## Server / Backend

ใช้สำหรับสร้าง API และจัดการ Logic ของระบบ

* **Node.js** - Runtime สำหรับ Backend
* **Express.js 5** - Framework สำหรับสร้าง REST API
* **TypeScript** - ภาษาหลักในการพัฒนา Backend
* **tsx** - ใช้สำหรับรัน TypeScript
* **CORS** - จัดการการเชื่อมต่อระหว่าง Frontend และ Backend
* **dotenv** - จัดการ Environment Variables
* **Zod** - ตรวจสอบและ Validate ข้อมูล Request

### Backend ทำหน้าที่

* สร้าง REST API
* ตรวจสอบข้อมูลจาก Request
* จัดการ Authentication และสิทธิ์ผู้ใช้งาน
* จัดการข้อมูลอุปกรณ์และหนังสือ
* จัดการข้อมูลห้อง
* จัดการข้อมูลผู้ใช้งาน
* จัดการระบบยืม-คืน
* คำนวณค่าปรับกรณีส่งคืนล่าช้า
* บันทึก Audit Log

---

## Database

ใช้ **MySQL 8** สำหรับจัดเก็บข้อมูลของระบบ

* **MySQL 8** - ระบบจัดการฐานข้อมูล
* **mysql2** - Library สำหรับเชื่อมต่อ Node.js กับ MySQL

### ข้อมูลที่จัดเก็บ

* ผู้ใช้งาน
* Role และสิทธิ์การใช้งาน
* อุปกรณ์
* หนังสือ
* หมวดหมู่
* ห้อง
* รายการยืม-คืน
* ค่าปรับ
* ประวัติการแก้ไขข้อมูล
* Audit Log

โครงสร้างฐานข้อมูลอยู่ที่

`database/schema.sql`

---

## Authentication

ระบบใช้ JWT และ bcryptjs สำหรับจัดการการเข้าสู่ระบบและความปลอดภัยของบัญชีผู้ใช้งาน

* **JWT (JSON Web Token)** - ใช้สำหรับ Login และตรวจสอบ Session
* **bcryptjs** - ใช้สำหรับ Hash Password
* **RBAC (Role-Based Access Control)** - ใช้ควบคุมสิทธิ์ตาม Role

### Roles

| Role    | รายละเอียด                             |
| ------- | -------------------------------------- |
| `ADMIN` | จัดการระบบ ผู้ใช้งาน และข้อมูลหลัก     |
| `STAFF` | จัดการการยืม-คืนและข้อมูลที่เกี่ยวข้อง |
| `USER`  | ใช้งานระบบในส่วนของผู้ยืม              |

---

## API

ระบบใช้ **REST API** สำหรับรับส่งข้อมูลระหว่าง Frontend และ Backend โดย Frontend ใช้ **Axios** ในการเรียก API

ตัวอย่างการทำงานของ API เช่น

* Login / Logout
* จัดการผู้ใช้งาน
* จัดการอุปกรณ์
* จัดการหนังสือ
* จัดการห้อง
* สร้างรายการยืม
* ดำเนินการคืน
* คำนวณค่าปรับ
* ดูประวัติการยืม-คืน
* บันทึก Audit Log

### Architecture

```text
React + TypeScript
        │
        │ Axios / REST API
        ▼
Node.js + Express
        │
        │ mysql2
        ▼
     MySQL 8
```
