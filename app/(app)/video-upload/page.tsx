"use client";
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Upload, Video, FileText, AlertCircle, X, CheckCircle } from 'lucide-react';

const VideoUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const MAX_FILE_SIZE = 70 * 1024 * 1024; // 70MB
  const MAX_FILE_SIZE_MB = MAX_FILE_SIZE / (1024 * 1024);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('video/')) {
        setFile(droppedFile);
      } else {
        setUploadError("Please upload a video file");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    
    if (!file) {
      setUploadError("Please select a video file");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    if (!title.trim()) {
      setUploadError("Please enter a title for your video");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      const res = await axios.post("/api/video-upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percentCompleted);
        }
      });
      console.log(res);
      setUploadSuccess(true);
      // Optionally redirect after success
      setTimeout(() => {
        router.push('/home');
      }, 2000);
      
    } catch (error) {
      console.log(error);
      setUploadError("Failed to upload video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const getFileSizeDisplay = () => {
    if (!file) return "";
    
    const sizeInMB = file.size / (1024 * 1024);
    const color = sizeInMB > MAX_FILE_SIZE_MB ? "text-red-500" : "text-green-500";
    
    return (
      <span className={`text-sm ${color}`}>
        {sizeInMB.toFixed(2)} MB {sizeInMB > MAX_FILE_SIZE_MB ? "(too large)" : ""}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Upload Video
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Share your videos with the CloudAI community
        </p>
      </div>

      {uploadSuccess ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6">
          <div className="flex items-center space-x-3 text-green-600 dark:text-green-400">
            <CheckCircle className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Upload Successful!</h2>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Your video has been uploaded and is now being processed.
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/home')}
              className="px-4 py-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6">
            <div className="flex items-center mb-4 space-x-2">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Video Details</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Enter a descriptive title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your video (optional)"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6">
            <div className="flex items-center mb-4 space-x-2">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <Video className="h-5 w-5 text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Video File</h2>
            </div>

            <div 
              className={`border-2 ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-dashed border-gray-300 dark:border-gray-700'} 
                          rounded-lg cursor-pointer h-40 flex items-center justify-center`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="text-center p-6">
                {file ? (
                  <div>
                    <Video className="h-10 w-10 text-blue-500 mx-auto mb-2" />
                    <p className="text-gray-800 dark:text-white font-medium">{file.name}</p>
                    <div className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex items-center justify-center">
                      {getFileSizeDisplay()}
                    </div>
                    <button
                      type="button"
                      className="mt-2 flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-800 dark:text-white font-medium">
                      Drag & drop your video or <span className="text-blue-500">browse</span>
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      Maximum file size: {MAX_FILE_SIZE_MB}MB
                      Compression till 40MB FILES  
                    </p>
                  </>
                )}
              </div>
            </div>

            {uploadError && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
                <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/home')}
              className="px-6 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading {uploadProgress}%
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Video
                </>
              )}
            </button>
          </div>

          {isUploading && (
            <div className="mt-2">
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default VideoUploadPage;