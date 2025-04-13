/**
 * Segmented File Upload Progress Demo
 * Copyright (c) 2025 Nuvio Labs
 * MIT License
 */

"use client"

import { useState } from "react"
import FileUploadProgress from "./file-upload-progress"
import { Button } from "@/components/ui/button"

export default function UploadDemo() {
  const [resetKey, setResetKey] = useState(0)

  const handleReset = () => {
    setResetKey((prev) => prev + 1)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">File Upload Progress</h1>
          <p className="text-gray-500">Upload a file to see the segmented progress bar</p>
        </div>

        <FileUploadProgress
          key={resetKey}
          simulateUpload={true}
          onFileSelect={(file) => console.log("Selected file:", file.name)}
        />

        {resetKey > 0 && (
          <div className="flex justify-center mt-6">
            <Button onClick={handleReset} variant="outline">
              Upload Another File
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
