import type React from 'react'
import { Navigate } from 'react-router-dom'
import { authService } from '@/services/authService'

function EducatorRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = authService.isAuthenticated()
  const user = authService.getUser()

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  if (user?.role !== 'educator') {
    return <Navigate to='/' replace />
  }

  return children
}

export default EducatorRoute
