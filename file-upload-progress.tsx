/**
 * Segmented File Upload Progress Component
 * Copyright (c) 2025 Nuvio Labs
 * MIT License
 */

"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Upload } from "lucide-react"

// Update the interface to be exported
export interface FileUploadProgressProps {
  onFileSelect?: (file: File) => void
  simulateUpload?: boolean
  totalSegments?: number
  className?: string
}

export default function FileUploadProgress({
  onFileSelect,
  simulateUpload = true,
  totalSegments = 20,
  className = "",
}: FileUploadProgressProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      setSelectedFile(file)
      if (onFileSelect) onFileSelect(file)

      // Start upload process
      setProgress(0)
      setIsUploading(true)
    }
  }

  // Simulate upload progress
  useEffect(() => {
    if (!isUploading || !simulateUpload) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (1 + Math.random())
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return newProgress
      })
    }, 200)

    return () => clearInterval(interval)
  }, [isUploading, simulateUpload])

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  // Calculate how many segments should be filled
  const filledSegments = Math.floor((progress / 100) * totalSegments)

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {!selectedFile && !isUploading ? (
        <button
          onClick={handleButtonClick}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Upload size={18} />
          Select File
        </button>
      ) : (
        <div className="w-full max-w-md bg-black rounded-xl p-5 text-white">
          <p className="text-gray-400 text-sm mb-1">{selectedFile?.name || "Uploading file..."}</p>
          <p className="text-3xl font-light mb-3">
            {Math.round(progress)}% {isUploading ? "Uploading" : "Uploaded"}
          </p>

          <div className="flex w-full h-10 gap-1">
            {Array.from({ length: totalSegments }).map((_, index) => (
              <div
                key={index}
                className={`flex-1 rounded-md transition-colors duration-300 ${
                  index < filledSegments ? "bg-white" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
    </div>
  )
}
