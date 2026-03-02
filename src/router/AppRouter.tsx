import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/person/Home'
import Activities from '../pages/person/Activities'
import AssessmentStart from '../pages/person/AssessmentStart'
import AssessmentThankYou from '../pages/person/AssessmentThankYou'
import Pehchan from '../pages/person/Pehchan'
import PehchanDashboard from '../pages/person/pehchan/Dashboard'
import PehchanIntelligence from '../pages/person/pehchan/Intelligence'
import PehchanPhysical from '../pages/person/pehchan/Physical'
import PehchanStats from '../pages/person/pehchan/Stats'
import CareersOverview from '../pages/person/pehchan/careers/CareersOverview'
import IntelligenceSkills from '../pages/person/pehchan/careers/IntelligenceSkills'
import SkillsVocations from '../pages/person/pehchan/careers/SkillsVocations'
import NsqfRoles from '../pages/person/pehchan/careers/NsqfRoles'
import PlanOverview from '../pages/person/pehchan/plan/PlanOverview'
import PlanTopStrengths from '../pages/person/pehchan/plan/TopStrengths'
import PlanLearningStyles from '../pages/person/pehchan/plan/LearningStyles'
import PlanIntelligenceProfile from '../pages/person/pehchan/plan/IntelligenceProfile'
import PlanAllStrengths from '../pages/person/pehchan/plan/AllStrengths'
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
import AdminActivityEditor from '../pages/educator/AdminActivityEditor'

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
        <Route
          path='assessments/:assessmentId/activities/:activityId/edit'
          element={<AdminActivityEditor />}
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
        path='/pehachan/dashboard'
        element={
          <ProtectedRoute>
            <PehchanDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path='/pehachan/dashboard/stats'
        element={
          <ProtectedRoute>
            <PehchanStats />
          </ProtectedRoute>
        }
      />
      <Route
        path='/pehachan/dashboard/careers'
        element={
          <ProtectedRoute>
            <CareersOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path='/pehachan/dashboard/careers/intelligence-skills'
        element={
          <ProtectedRoute>
            <IntelligenceSkills />
          </ProtectedRoute>
        }
      />
      <Route
        path='/pehachan/dashboard/careers/skills-vocations'
        element={
          <ProtectedRoute>
            <SkillsVocations />
          </ProtectedRoute>
        }
      />
      <Route
        path='/pehachan/dashboard/careers/nsqf-roles'
        element={
          <ProtectedRoute>
            <NsqfRoles />
          </ProtectedRoute>
        }
      />
      <Route
        path='/pehachan/dashboard/plan'
        element={
          <ProtectedRoute>
            <PlanOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path='/pehachan/dashboard/plan/overview'
        element={
          <ProtectedRoute>
            <PlanOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path='/pehachan/dashboard/plan/strengths'
        element={
          <ProtectedRoute>
            <PlanTopStrengths />
          </ProtectedRoute>
        }
      />
      <Route
        path='/pehachan/dashboard/plan/styles'
        element={
          <ProtectedRoute>
            <PlanLearningStyles />
          </ProtectedRoute>
        }
      />
      <Route
        path='/pehachan/dashboard/plan/profile'
        element={
          <ProtectedRoute>
            <PlanIntelligenceProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path='/pehachan/dashboard/plan/growth'
        element={
          <ProtectedRoute>
            <PlanAllStrengths />
          </ProtectedRoute>
        }
      />
      <Route
        path='/pehachan/intelligence/:attribute?'
        element={
          <ProtectedRoute>
            <PehchanIntelligence />
          </ProtectedRoute>
        }
      />
      <Route
        path='/pehachan/physical/:attribute?'
        element={
          <ProtectedRoute>
            <PehchanPhysical />
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
