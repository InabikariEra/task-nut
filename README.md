# Equipment & Laboratory Borrowing Management System

ระบบยืม-คืนอุปกรณ์ ห้องปฏิบัติการ และหนังสือสำหรับสถานศึกษา

## โหมดฐานข้อมูลจริง

โปรเจกต์มี `database/schema.sql` สำหรับ MySQL 8 และ Backend Express + TypeScript ใน `server/` รองรับ users/roles, equipment/books, categories, rooms, borrowings, returns, fines และ audit logs

บัญชี Admin สำหรับ seed:

```text
Email: suparuek.mem@gmail.com
Password: 123456
```

เริ่มใช้งาน:

1. รัน `database/schema.sql` ใน MySQL 8
2. คัดลอก `server/.env.example` เป็น `server/.env` และตั้งค่าการเชื่อมต่อ MySQL
3. ตั้งค่า root `.env` เป็น `VITE_USE_API=true` และ `VITE_API_URL=http://localhost:4000/api`
4. รัน Backend ด้วย `cd server; npm install; npm run dev`
5. รัน Frontend ด้วย `npm run dev`

หรือใช้ `npm run dev:all` เพื่อรันทั้งสองฝั่งพร้อมกัน

โหมด `VITE_USE_API=false` จะใช้ Mock Data/Mock Store เดิมสำหรับพัฒนา UI โดยไม่ต้องเปิด MySQL

API หลักอยู่ที่ `/api/auth`, `/api/catalog`, `/api/admin` และ `/api/borrowings` โดยการแก้ไขข้อมูล Admin จะถูกบันทึกใน `audit_logs`

## ตรวจสอบโค้ด

```powershell
npm run lint
npm run build
cd server
npm run build
```

---

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
