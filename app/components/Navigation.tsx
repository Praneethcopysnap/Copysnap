import { SignOutButton } from './SignOutButton'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiLayers, FiSettings } from 'react-icons/fi'

export function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="flex flex-col h-full p-4 bg-gray-100">
      <div className="flex-1 space-y-2">
        <Link 
          href="/dashboard" 
          className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
            isActive('/dashboard') 
              ? 'bg-primary text-white' 
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FiHome className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>

        <Link 
          href="/workspaces" 
          className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
            isActive('/workspaces') 
              ? 'bg-primary text-white' 
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FiLayers className="w-5 h-5" />
          <span>Workspaces</span>
        </Link>

        <Link 
          href="/settings" 
          className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
            isActive('/settings') 
              ? 'bg-primary text-white' 
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FiSettings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </div>
      <div className="mt-auto">
        <SignOutButton />
      </div>
    </nav>
  )
} 