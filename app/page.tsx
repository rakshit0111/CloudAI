"use client";
import { useRouter } from "next/navigation";
import { useEffect, } from "react";
import { Cloud } from "lucide-react";

export default function Home() {
  const router = useRouter();
  

  useEffect(() => {
    // Add a delay to show the loader animation before redirecting
    const redirectTimer = setTimeout(() => {
      router.push("/sign-in");
    }, 2000); // 2 second delay

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mx-auto h-20 w-20 mb-5">
          {/* Cloud background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
          
          {/* Spinning ring */}
          <div className="absolute inset-0">
            <div className="h-full w-full rounded-full border-4 border-transparent border-t-blue-500 border-r-teal-400 animate-spin"></div>
          </div>
          
          {/* CloudAI logo in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Cloud className="h-10 w-10 text-blue-500 dark:text-blue-400" />
          </div>
        </div>
        
        {/* Logo text */}
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 text-transparent bg-clip-text">
          CloudAI
        </h1>
        
        {/* Loading text */}
        <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm flex items-center justify-center">
          <span className="mr-2">Loading</span>
          <span className="flex space-x-1">
            <span className="w-1 h-1 rounded-full bg-gray-600 dark:bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
            <span className="w-1 h-1 rounded-full bg-gray-600 dark:bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
            <span className="w-1 h-1 rounded-full bg-gray-600 dark:bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
          </span>
        </p>
      </div>
    </div>
  );
}