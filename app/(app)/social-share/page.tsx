"use client"

import React, { useState, useEffect, useRef } from 'react';
import { CldImage } from 'next-cloudinary';
import { Upload, Image as ImageIcon, Download, Check, Loader } from 'lucide-react';

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type socialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<socialFormat>("Instagram Square (1:1)");
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file)
      return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok)
        throw new Error("Image uploading error");

      const data = await response.json();
      setUploadedImage(data.publicId);

    } catch (error) {
      console.log("Error while uploading image", error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  }

  const handleDownload = () => {
    if (!imageRef.current)
      return;

    fetch(imageRef.current.src)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat.replace(/\s+/g, "_").toLowerCase()}.png`;

        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Social Media Image Creator
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Resize and format your images for different social media platforms
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex items-center mb-4 space-x-2">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <Upload className="h-5 w-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Upload an Image</h2>
          </div>
          
          <label className="flex flex-col items-center justify-center w-full h-32 
                          border-2 border-dashed border-gray-300 dark:border-gray-700 
                          rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900/50 
                          hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileUpload}
              accept="image/*"
            />
          </label>
          
          {isUploading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                <div className="bg-gradient-to-r from-blue-500 to-teal-400 h-2.5 rounded-full animate-pulse w-3/4"></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                <Loader className="h-3 w-3 animate-spin mr-2" />
                Uploading your image...
              </p>
            </div>
          )}
        </div>
      </div>

      {uploadedImage && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4 space-x-2">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Transform Your Image</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Format
                </label>
                <select
                  className="block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as socialFormat)}
                >
                  {Object.keys(socialFormats).map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Format Details</h3>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Dimensions:</p>
                        <p className="font-medium text-gray-700 dark:text-gray-300">
                          {socialFormats[selectedFormat].width} × {socialFormats[selectedFormat].height}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Aspect Ratio:</p>
                        <p className="font-medium text-gray-700 dark:text-gray-300">
                          {socialFormats[selectedFormat].aspectRatio}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium rounded-lg flex items-center justify-center"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Image
                </button>
              </div>
              
              <div className="md:col-span-2 relative">
                <div className="bg-[#f0f0f0] dark:bg-gray-900/50 rounded-lg p-2 h-full flex items-center justify-center">
                  <div className="relative w-full max-w-md mx-auto">
                    {isTransforming && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 rounded-lg">
                        <div className="h-10 w-10 relative">
                          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500"></div>
                        </div>
                      </div>
                    )}
                    <CldImage
                      width={socialFormats[selectedFormat].width}
                      height={socialFormats[selectedFormat].height}
                      src={uploadedImage}
                      sizes="100vw"
                      alt="transformed image"
                      crop="fill"
                      aspectRatio={socialFormats[selectedFormat].aspectRatio}
                      gravity='auto'
                      ref={imageRef}
                      onLoad={() => setIsTransforming(false)}
                      className="w-full h-auto rounded-md shadow-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}