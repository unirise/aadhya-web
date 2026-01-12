import { Routes, Route } from 'react-router-dom'
import Activities from '../pages/Activities'
import Pehchan from '../pages/Pehchan'
import Sajag from '../pages/Sajag'
import NotFound from '../pages/NotFound'

function AppRouter() {
  return (
    <Routes>
      <Route path='/' element={<Activities />} />
      <Route path='/activities' element={<Activities />} />
      <Route path='/pehchan' element={<Pehchan />} />
      <Route path='/sajag' element={<Sajag />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter
