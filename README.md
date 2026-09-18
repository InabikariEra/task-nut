
ระบบยืม-คืนอุปกรณ์ ห้องปฏิบัติการ จากคนโหดๆ

 npm i ครั้งแรกเมื่อโหลดโปรเจค
 npm run dev  เพื่อรัน

บัญชี Admin 

```text
Email: suparuek.mem@gmail.com
Password: 123456
```

โหมด `VITE_USE_API=false` จะใช้ Mock Data/Mock Store เดิมสำหรับพัฒนา UI แบบไม่เปิด MySQL

API หลักอยู่ที่ `/api/auth`, `/api/catalog`, `/api/admin` และ `/api/borrowings` โดยการแก้ไขข้อมูล Admin จะถูกบันทึกใน `audit_logs`
