import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RoleSelection from "./pages/auth/RoleSelection";
import ForgotPassword from "./pages/auth/ForgotPassword";
import StudentLoginPage from "./pages/student/StudentLoginPage";
import StudentCreateAccount from "./pages/student/StudentCreateAccount";
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherLayout from "./layouts/TeacherLayout";
import TeacherLoginPage from "./pages/teacher/TeacherLoginPage";
import TeacherCreateAccount from "./pages/teacher/TeacherCreateAccount";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import GradesPortal from "./pages/teacher/GradesPortal";
import ClassList from "./pages/teacher/ClassList";
import AttendancePage from "./pages/teacher/AttendancePage";
import ReportsPage from "./pages/teacher/ReportsPage";
import CustomerService from "./pages/teacher/CustomerService";
import AdminLayout from "./layouts/AdminLayout";
import AdminCreateAccount from "./pages/admin/AdminCreateAccount";
import AdminLogin from "./pages/admin/AdminLogin";  
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTeachers from "./pages/admin/AdminTeachers";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminGrades from "./pages/admin/AdminGrades";
import AdminClasses from "./pages/admin/AdminClasses";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AdminReports from "./pages/admin/AdminReports";

function App() {
return ( <Router> <Routes>
<Route path="/" element={<Navigate to="/role-selection" />} />
    <Route path="/role-selection" element={<RoleSelection />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />

    <Route path="/student/student-login" element={<StudentLoginPage />} />
    <Route path="/student/student-create-account" element={<StudentCreateAccount />} />
    <Route path="/student/student-dashboard" element={<StudentDashboard />} />

    <Route path="/teacher/teacher-login" element={<TeacherLoginPage />} />
    <Route path="/teacher/teacher-create-account" element={<TeacherCreateAccount />} />
    <Route element={<TeacherLayout />}>
      <Route path="/teacher/teacher-dashboard" element={<TeacherDashboard />} />
      <Route path="/grades-portal" element={<GradesPortal />} />
      <Route path="/class-list" element={<ClassList />} />
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/customer-service" element={<CustomerService />} />
    </Route>

    <Route path="/admin/admin-login" element={<AdminLogin />} />
    <Route path="/admin/admin-create-account" element={<AdminCreateAccount />} />
    <Route element={<AdminLayout />}>
      <Route path="/admin/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin/admin-teachers" element={<AdminTeachers />} />
      <Route path="/admin/admin-students" element={<AdminStudents />} />
      <Route path="/admin/admin-grades" element={<AdminGrades />} />
      <Route path="/admin/admin-classes" element={<AdminClasses />} />
      <Route path="/admin/admin-attendance" element={<AdminAttendance />} />
      <Route path="/admin/admin-reports" element={<AdminReports />} />
    </Route>
  </Routes>
</Router>

);
}

export default App;
