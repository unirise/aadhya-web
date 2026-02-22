import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/person/Home'
import Activities from '../pages/person/Activities'
import AssessmentStart from '../pages/person/AssessmentStart'
import AssessmentThankYou from '../pages/person/AssessmentThankYou'
import Pehchan from '../pages/person/Pehchan'
import Sajag from '../pages/person/Sajag'
import Login from '../pages/common/Login'
import Presentation from '../pages/common/Presentation'
import NotFound from '../pages/common/NotFound'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import EducatorRoute from '../components/auth/EducatorRoute'
import DashboardLayout from '../components/layouts/DashboardLayout'
import Dashboard from '../pages/educator/Dashboard'
import Children from '../pages/educator/Children'
import ChildProfile from '../pages/educator/ChildProfile'
import Assessments from '../pages/educator/Assessments'
import AssessmentActivities from '../pages/educator/AssessmentActivities'

function AppRouter() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />

      {/* Educator dashboard routes */}
      <Route
        path='/dashboard'
        element={
          <EducatorRoute>
            <DashboardLayout />
          </EducatorRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path='children' element={<Children />} />
        <Route path='children/:childId' element={<ChildProfile />} />
        <Route path='assessments' element={<Assessments />} />
        <Route
          path='assessments/:assessmentId/activities'
          element={<AssessmentActivities />}
        />
      </Route>

      {/* Home page - main landing page after login */}
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path='/home'
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route path='/activities' element={<Navigate to='/' replace />} />

      <Route
        path='/assessment/:assessmentId/start'
        element={
          <ProtectedRoute>
            <AssessmentStart />
          </ProtectedRoute>
        }
      />

      <Route
        path='/assessment/:assessmentId/activity/:activityId'
        element={
          <ProtectedRoute>
            <Activities />
          </ProtectedRoute>
        }
      />

      <Route
        path='/assessment/:assessmentId/thank-you'
        element={
          <ProtectedRoute>
            <AssessmentThankYou />
          </ProtectedRoute>
        }
      />

      <Route
        path='/pehachan'
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
      <Route path='/presentation' element={<Presentation />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter
