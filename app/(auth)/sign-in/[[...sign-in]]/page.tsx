import { SignIn } from '@clerk/nextjs';
import { Cloud, ImageIcon, VideoIcon, Download } from 'lucide-react';

export default function Page() {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Dark Theme */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#121212]">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center space-y-8">
            {/* Logo */}
            <div className="mb-2">
              <div className="h-12 w-12 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full opacity-20 blur-md"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cloud className="h-8 w-8 text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-teal-400" fill="url(#cloud-gradient)" />
                </div>
              </div>
              <defs>
                <linearGradient id="cloud-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2dd4bf" />
                </linearGradient>
              </defs>
            </div>

            {/* Login Header */}
            <h1 className="text-2xl font-bold text-white mb-6">Log in to CloudAI</h1>
            
            {/* Clerk SignIn - Custom Appearance */}
            <div className="w-full">
              <SignIn appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none p-0 border-0",
                  header: "hidden",
                  footer: "hidden",
                  formButtonPrimary: 
                    "bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium py-3 rounded-md transition-all w-full",
                  formFieldInput: 
                    "bg-[#1e1e1e] border border-[#333] text-white rounded-md p-3 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 w-full",
                  formFieldLabel: "text-gray-400",
                  formFieldError: "text-red-400",
                  dividerLine: "bg-[#333]",
                  dividerText: "text-gray-400",
                  identityPreview: "bg-[#1e1e1e] border border-[#333]",
                  alternativeMethodsBlockButton: "text-gray-300 hover:text-white",
                  socialButtonsBlockButton: 
                    "bg-[#1e1e1e] border border-[#333] text-white hover:bg-[#252525] flex justify-center py-3 rounded-md transition-all w-full mb-2",
                  socialButtonsIconButton: "text-white",
                  formFieldAction: "text-gray-300 hover:text-blue-400",
                  footerAction: "text-gray-300 hover:text-blue-400",
                }
              }} />
            </div>

            {/* Additional Links */}
            <div className="text-center text-sm text-gray-400 mt-4">
              <p>Don't have an account? <a href="#" className="text-blue-400 hover:underline">Create your account</a></p>
              <a href="#" className="inline-block mt-3 text-gray-400 hover:text-blue-400">Continue with SSO</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Gradient Background */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-700">
        <div className="absolute inset-0 bg-[url('/images/mesh-gradient.png')] bg-cover opacity-20"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 w-full max-w-lg">
            <div className="text-white space-y-6">
              <h2 className="text-2xl font-bold mb-4">Transform your media with CloudAI</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-lg mr-3">
                    <ImageIcon className="h-5 w-5 text-blue-300" />
                  </div>
                  <p className="text-white/80">
                    Convert images into various formats and resize to perfect aspect ratios
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-lg mr-3">
                    <VideoIcon className="h-5 w-5 text-blue-300" />
                  </div>
                  <p className="text-white/80">
                    Compress videos while maintaining quality for faster sharing
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-lg mr-3">
                    <Cloud className="h-5 w-5 text-blue-300" />
                  </div>
                  <p className="text-white/80">
                    Generate AI previews of your videos for quick insights
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-lg mr-3">
                    <Download className="h-5 w-5 text-blue-300" />
                  </div>
                  <p className="text-white/80">
                    Download your processed files instantly to any device
                  </p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-12 -right-12 h-24 w-24">
              <div className="absolute inset-0 bg-blue-400 rounded-full opacity-10 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}