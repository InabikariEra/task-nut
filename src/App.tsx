import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import type { ReactElement } from "react";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import AdminLayout from "./layouts/AdminLayout";
import StaffLayout from "./layouts/StaffLayout";
import UserLayout from "./layouts/UserLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminCategories from "./pages/admin/Categories";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminEquipment from "./pages/admin/Equipment";
import AdminReports from "./pages/admin/Reports";
import AdminRooms from "./pages/admin/Rooms";
import AdminUsers from "./pages/admin/Users";
import StaffBorrowRequests from "./pages/staff/BorrowRequests";
import StaffDashboard from "./pages/staff/Dashboard";
import StaffReturns from "./pages/staff/Returns";
import UserBorrowings from "./pages/user/Borrowings";
import UserDashboard from "./pages/user/Dashboard";
import UserEquipment from "./pages/user/Equipment";
import UserEquipmentDetail from "./pages/user/EquipmentDetail";
import UserFines from "./pages/user/Fines";
import UserProfile from "./pages/user/Profile";
import UserRooms from "./pages/user/Rooms";
import type { UserRole } from "./types";

function ProtectedRoute({
  roles,
  layout,
}: {
  roles: UserRole[];
  layout: ReactElement;
}) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!roles.includes(user.role)) {
    const landingPath =
      user.role === "ADMIN"
        ? "/admin/dashboard"
        : user.role === "STAFF"
          ? "/staff/dashboard"
          : "/dashboard";
    return <Navigate to={landingPath} replace />;
  }
  return layout;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={<ProtectedRoute roles={["USER"]} layout={<UserLayout />} />}
        >
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/equipment" element={<UserEquipment />} />
          <Route path="/equipment/:id" element={<UserEquipmentDetail />} />
          <Route path="/borrowings" element={<UserBorrowings />} />
          <Route path="/fines" element={<UserFines />} />
          <Route path="/rooms" element={<UserRooms />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>
        <Route
          element={
            <ProtectedRoute roles={["STAFF"]} layout={<StaffLayout />} />
          }
        >
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route
            path="/staff/borrow-requests"
            element={<StaffBorrowRequests />}
          />
          <Route path="/staff/returns" element={<StaffReturns />} />
        </Route>
        <Route
          element={
            <ProtectedRoute roles={["ADMIN"]} layout={<AdminLayout />} />
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/equipment" element={<AdminEquipment />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/rooms" element={<AdminRooms />} />
          <Route path="/admin/reports" element={<AdminReports />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
