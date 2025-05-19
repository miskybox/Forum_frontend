// Archivo: src/components/auth/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import PropTypes from 'prop-types'

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, currentUser, loading } = useAuth()
  const location = useLocation()
  
  // Mientras se verifica la autenticación, mostrar un loader o nada
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  // Si se requieren roles específicos, verificar que el usuario tenga al menos uno de ellos
  if (requiredRoles.length > 0) {
    const userRoles = currentUser?.roles || []
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role))
    
    if (!hasRequiredRole) {
      // Redirigir a una página de acceso denegado o a la página principal
      return <Navigate to="/forbidden" replace />
    }
  }
  
  // Si está autenticado (y tiene los roles requeridos si se especificaron), mostrar el contenido protegido
  return children
}
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRoles: PropTypes.arrayOf(PropTypes.string)
}


export default ProtectedRoute