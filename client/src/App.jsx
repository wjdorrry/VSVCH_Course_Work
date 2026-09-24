import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import MenuPage from './pages/MenuPage.jsx';
import RequestPage from './pages/RequestPage.jsx';
import MyRequestsPage from './pages/MyRequestsPage.jsx';
import ManagerDashboardPage from './pages/ManagerDashboardPage.jsx';
import ManagerRequestsPage from './pages/ManagerRequestsPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute roles={['CLIENT']} />}>
          <Route path="request" element={<RequestPage />} />
          <Route path="my-requests" element={<MyRequestsPage />} />
        </Route>
        <Route element={<ProtectedRoute roles={['MANAGER']} />}>
          <Route path="manager" element={<ManagerDashboardPage />} />
          <Route path="manager/requests" element={<ManagerRequestsPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
        <Route path="404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
