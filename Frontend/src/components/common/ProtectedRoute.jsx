import { Navigate, Outlet } from 'react-router-dom'

const getToken = () =>
  localStorage.getItem('token') || sessionStorage.getItem('token')

const ProtectedRoute = () => {
  return getToken() ? <Outlet /> : <Navigate to='/login' replace />
}

export default ProtectedRoute
