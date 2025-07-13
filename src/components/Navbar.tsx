'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Map, Star, User, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
            <span className="text-2xl">🐄</span>
            <span>CattleCheck</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/map" className="flex items-center space-x-1 hover:text-green-200 transition-colors">
              <Map className="w-4 h-4" />
              <span>Explore Map</span>
            </Link>
            <Link href="/cattle-guards" className="flex items-center space-x-1 hover:text-green-200 transition-colors">
              <Star className="w-4 h-4" />
              <span>All Guards</span>
            </Link>
            
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="flex items-center space-x-1 hover:text-green-200 transition-colors">
                  <User className="w-4 h-4" />
                  <span>{session.user?.name}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 hover:text-green-200 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Join the Herd!
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-green-500 py-4 space-y-2">
            <Link 
              href="/map" 
              className="block px-3 py-2 hover:bg-green-700 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              🗺️ Explore Map
            </Link>
            <Link 
              href="/cattle-guards" 
              className="block px-3 py-2 hover:bg-green-700 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              ⭐ All Guards
            </Link>
            
            {session ? (
              <>
                <Link 
                  href="/profile" 
                  className="block px-3 py-2 hover:bg-green-700 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  👤 {session.user?.name}
                </Link>
                <button
                  onClick={() => {
                    signOut()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 hover:bg-green-700 rounded-lg transition-colors"
                >
                  🚪 Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  signIn('google')
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                🎉 Join the Herd!
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}