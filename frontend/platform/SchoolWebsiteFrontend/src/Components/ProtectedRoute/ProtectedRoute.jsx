import { Navigate, Outlet } from "react-router-dom";
import './ProtectedRoute.css'

function ProtectedRoute({ allowedRoles, userRole, isLoading }) {
    if (isLoading) {
        return <div className="loading-screen">Загрузка...</div>;
      }

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;