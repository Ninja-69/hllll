"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function ModernBottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/",
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-black' : 'text-text-muted'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: "Home"
    },
    {
      href: "/diary",
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-black' : 'text-text-muted'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      label: "Stats"
    },
    {
      href: "/add-meal",
      icon: (active: boolean) => (
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          active ? 'bg-accent shadow-glow' : 'bg-accent'
        } transition-all duration-300`}>
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      ),
      label: "",
      isCenter: true
    },
    {
      href: "/progress",
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-black' : 'text-text-muted'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      label: "Progress"
    },
    {
      href: "/profile",
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-black' : 'text-text-muted'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      label: "Profile"
    }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-elevated/80 backdrop-blur-xl border-t border-border/50">
      <div className="flex items-center justify-around px-4 py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-300 ${
                item.isCenter 
                  ? 'transform -translate-y-2' 
                  : isActive 
                    ? 'bg-accent text-black' 
                    : 'hover:bg-surface-elevated'
              }`}
            >
              {item.icon(isActive)}
              {item.label && (
                <span className={`text-xs mt-1 font-medium ${
                  isActive ? 'text-black' : 'text-text-muted'
                }`}>
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}