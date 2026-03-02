import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { authService } from '@/services/authService'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home', end: true },
  { to: '/dashboard/children', icon: Users, label: 'Children', end: false },
  {
    to: '/dashboard/assessments',
    icon: ClipboardList,
    label: 'Assessments',
    end: false,
  },
]

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const user = authService.getUser()

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  return (
    <div className='flex h-screen bg-background'>
      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col border-r border-border bg-card transition-all duration-200',
          sidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        {/* Sidebar header */}
        <div className='flex h-14 items-center border-b border-border px-4'>
          {sidebarOpen && (
            <span className='text-lg font-semibold text-foreground'>
              Aadhya
            </span>
          )}
          <Button
            variant='ghost'
            size='sm'
            className={cn(sidebarOpen ? 'ml-auto' : 'mx-auto')}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className='size-4' />
            ) : (
              <Menu className='size-4' />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className='flex-1 space-y-1 p-2'>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              <item.icon className='size-4 shrink-0' />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer / user info */}
        <div className='border-t border-border p-2'>
          {sidebarOpen && (
            <div className='mb-2 px-3 py-1'>
              <p className='text-sm font-medium text-foreground truncate'>
                {user?.name}
              </p>
              <p className='text-xs text-muted-foreground truncate'>Educator</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className='flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive'
          >
            <LogOut className='size-4 shrink-0' />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className='flex-1 overflow-hidden flex flex-col min-h-0'>
        <div className='flex-1 min-h-0 overflow-auto p-6'>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
