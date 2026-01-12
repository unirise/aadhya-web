import { Routes, Route, Navigate } from 'react-router-dom'
import Activities from '../pages/Activities'
import Pehchan from '../pages/Pehchan'
import Sajag from '../pages/Sajag'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import ProtectedRoute from '../components/ProtectedRoute'

function AppRouter() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <Activities />
          </ProtectedRoute>
        }
      />
      <Route
        path='/activities'
        element={
          <ProtectedRoute>
            <Activities />
          </ProtectedRoute>
        }
      />
      <Route
        path='/pehchan'
        element={
          <ProtectedRoute>
            <Pehchan />
          </ProtectedRoute>
        }
      />
      <Route
        path='/sajag'
        element={
          <ProtectedRoute>
            <Sajag />
          </ProtectedRoute>
        }
      />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter
