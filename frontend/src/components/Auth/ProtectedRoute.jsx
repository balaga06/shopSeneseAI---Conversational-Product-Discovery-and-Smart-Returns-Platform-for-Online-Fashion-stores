import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated } = useAuth()

  // User is not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // User is logged in but does not have permission
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/unauthorized" replace />
  }

  // User is authenticated and authorized
  return <Outlet />
}

export default ProtectedRoute