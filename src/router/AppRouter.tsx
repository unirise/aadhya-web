import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Activities from '../pages/Activities'
import AssessmentStart from '../pages/AssessmentStart'
import AssessmentThankYou from '../pages/AssessmentThankYou'
import Pehchan from '../pages/Pehchan'
import Sajag from '../pages/Sajag'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import ProtectedRoute from '../components/ProtectedRoute'

function AppRouter() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      
      {/* Home page - now the main landing page after login */}
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      
      {/* Home route alias */}
      <Route
        path='/home'
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      
      {/* Legacy activities route - redirects to home */}
      <Route
        path='/activities'
        element={<Navigate to='/' replace />}
      />
      
      {/* Assessment start page - shows overview before starting */}
      <Route
        path='/assessment/:assessmentId/start'
        element={
          <ProtectedRoute>
            <AssessmentStart />
          </ProtectedRoute>
        }
      />
      
      {/* New assessment-based activities route with parameters */}
      <Route
        path='/assessment/:assessmentId/activity/:activityId'
        element={
          <ProtectedRoute>
            <Activities />
          </ProtectedRoute>
        }
      />
      
      {/* Assessment completion thank you page */}
      <Route
        path='/assessment/:assessmentId/thank-you'
        element={
          <ProtectedRoute>
            <AssessmentThankYou />
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
