"use client";
import React, { useState, useCallback, useEffect } from 'react';
import VideoCard from '@/components/VideoCard';
import axios from 'axios';
import { Video } from '@/types';
import { Cloud, Search, Filter, RefreshCw, AlertCircle } from 'lucide-react';

const HomePage = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchVideos = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const res = await axios.get("/api/video");

      if (Array.isArray(res.data)) {
        setVideos(res.data);
      } else {
        throw new Error("Unexpected response format while fetching videos");
      }
    } catch (e) {
      console.log(e);
      setError("Failed to fetch videos");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDownload = useCallback((url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const filteredVideos = videos.filter(video => 
    video.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3 h-8 w-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full opacity-20 blur-sm"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Cloud className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">CloudAI</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={fetchVideos}
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${isRefreshing ? 'animate-spin text-blue-500' : ''}`}
              disabled={isRefreshing}
              aria-label="Refresh videos"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        {/* Search and filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Videos</h2>
          
          <div className="relative w-full sm:w-64 md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            />
          </div>
        </div>
        
        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800 dark:text-red-400">Error loading videos</h3>
              <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
              <button 
                onClick={fetchVideos} 
                className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
              >
                Try again
              </button>
            </div>
          </div>
        )}
        
        {/* Loading state */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Video grid */}
            {filteredVideos.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full inline-flex mb-4">
                  <Filter className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">
                  {searchTerm ? "No videos match your search" : "No videos available"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? "Try adjusting your search terms" : "Upload your first video to get started"}
                </p>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;