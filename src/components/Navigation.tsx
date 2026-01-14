import { useLocation, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { ActionBlock, NavigationBlock, SettingBlock } from './blocks'

function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const isAuthenticated = authService.isAuthenticated()

  const handleBack = () => {
    navigate(-1)
  }

  // Don't show navigation on login page
  if (location.pathname === '/login') {
    return null
  }

  return (
    <div className='h-[64px] z-[1000] mb-4'>
      <div className='max-w-7xl mx-auto h-full'>
        <div className='grid grid-cols-5 lg:grid-cols-9 gap-4 h-full items-center'>
          {/* Home Link - spans first column */}
          <div className='col-span-1 flex items-center justify-center h-full w-full p-1'>
            <NavigationBlock label='Home' to='/' />
          </div>

          <div className='hidden lg:block' />
          <div />
          <div className='hidden lg:block' />

          {/* Back Button - spans middle column(s) */}
          <div className='col-span-1 flex items-center justify-center h-full w-full p-1'>
            <ActionBlock label='Back' onClick={handleBack} />
          </div>

          <div className='hidden lg:block' />
          <div />

          <div className='col-span-1 flex items-center justify-center h-full w-full p-1'>
            <SettingBlock label={'Settings'} onClick={() => {}} />
          </div>

          {/* User Info and Profile Link - spans last column */}
          {isAuthenticated && (
            <div className='col-span-1 flex items-center justify-center h-full w-full p-1'>
              <NavigationBlock label={'Pehachan'} to='/pehachan' />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navigation
