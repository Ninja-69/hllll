"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HomeIcon, DiaryIcon, ProgressIcon, ProfileIcon, PlusIcon } from "./icons"

export function BottomNav() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 flex items-center justify-between md:hidden">
      <Link
        href="/"
        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
          isActive("/") ? "text-primary" : "text-text-muted hover:text-text"
        }`}
      >
        <HomeIcon className="w-6 h-6" />
        <span className="text-xs">Home</span>
      </Link>

      <Link
        href="/diary"
        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
          isActive("/diary") ? "text-primary" : "text-text-muted hover:text-text"
        }`}
      >
        <DiaryIcon className="w-6 h-6" />
        <span className="text-xs">Diary</span>
      </Link>

      <Link
        href="/add-meal"
        className="flex flex-col items-center gap-1 p-2 rounded-lg text-primary hover:bg-highlight transition-colors -mt-6"
      >
        <div className="bg-primary text-white rounded-full p-3 shadow-lg">
          <PlusIcon className="w-6 h-6" />
        </div>
        <span className="text-xs">Add</span>
      </Link>

      <Link
        href="/progress"
        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
          isActive("/progress") ? "text-primary" : "text-text-muted hover:text-text"
        }`}
      >
        <ProgressIcon className="w-6 h-6" />
        <span className="text-xs">Progress</span>
      </Link>

      <Link
        href="/profile"
        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
          isActive("/profile") ? "text-primary" : "text-text-muted hover:text-text"
        }`}
      >
        <ProfileIcon className="w-6 h-6" />
        <span className="text-xs">Profile</span>
      </Link>
    </nav>
  )
}
