"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  LogOut,
  Menu,
  LayoutDashboard,
  Share2,
  Upload,
  Cloud,

  X,
  ChevronRight
} from "lucide-react";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboard, label: "Home Page" },
  { href: "/social-share", icon: Share2, label: "Image Upload" },
  { href: "/video-upload", icon: Upload, label: "Video Upload" },
];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  const handleLogoClick = () => {
    router.push("/home");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out 
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Close button - mobile only */}
        <button 
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
        
        {/* Logo */}
        <div className="flex items-center p-4 mb-6">
          <div className="mr-3 h-8 w-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full opacity-20 blur-sm"></div>
            <div onClick ={handleLogoClick} className="absolute inset-0 flex items-center justify-center">
              <Cloud className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white">CloudAI</span>
        </div>
        
        {/* Navigation */}
        <nav className="px-4 py-2">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-colors group
                    ${pathname === item.href 
                      ? 'bg-gradient-to-r from-blue-500/10 to-teal-400/10 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`h-5 w-5 mr-3 ${
                    pathname === item.href 
                      ? 'text-blue-500' 
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`
                  } />
                  <span>{item.label}</span>
                  {pathname === item.href && (
                    <ChevronRight className="ml-auto h-4 w-4 text-blue-500" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* User section at bottom */}
        {user && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center mb-4">
              <div className="h-9 w-9 rounded-full overflow-hidden mr-3">
                <img
                  src={user.imageUrl}
                  alt={user.username || user.emailAddresses[0].emailAddress}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                  {user.fullName || user.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.emailAddresses[0].emailAddress}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
              Sign out
            </button>
          </div>
        )}
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="lg:hidden flex items-center">
              <div className="mr-3 h-8 w-8 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full opacity-20 blur-sm"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cloud className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">CloudAI</h1>
            </div>
            
            {/* User menu - mobile only */}
            <div className="flex lg:hidden">
              {user && (
                <button className="h-8 w-8 rounded-full overflow-hidden">
                  <img
                    src={user.imageUrl}
                    alt={user.username || user.emailAddresses[0].emailAddress}
                    className="h-full w-full object-cover"
                  />
                </button>
              )}
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 container mx-auto px-4 py-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}