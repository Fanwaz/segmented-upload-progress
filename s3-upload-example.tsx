"use client"

import { useState } from "react"
import FileUploadProgress from "./file-upload-progress"

export default function S3UploadExample() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null)

  const handleFileSelect = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)
    setUploadedFileUrl(null)

    try {
      // Step 1: Get a pre-signed URL from your backend
      const response = await fetch("/api/get-upload-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get upload URL")
      }

      const { url, fields } = await response.json()

      // Step 2: Create FormData with the file and pre-signed URL fields
      const formData = new FormData()

      // Add all the fields from the pre-signed URL
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string)
      })

      // Add the file as the last field
      formData.append("file", file)

      // Step 3: Upload to S3 with progress tracking
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100)
          setUploadProgress(percentComplete)
        }
      })

      xhr.addEventListener("load", () => {
        if (xhr.status === 204) {
          // S3 returns 204 No Content on successful upload
          const fileUrl = `${url}${fields.key}`
          setUploadedFileUrl(fileUrl)
          setIsUploading(false)
        } else {
          console.error("Upload failed with status:", xhr.status)
          setIsUploading(false)
        }
      })

      xhr.addEventListener("error", () => {
        console.error("Upload failed")
        setIsUploading(false)
      })

      xhr.open("POST", url, true)
      xhr.send(formData)
    } catch (error) {
      console.error("Error during upload:", error)
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Upload to S3</h2>

      <FileUploadProgress onFileSelect={handleFileSelect} simulateUpload={false} />

      {isUploading && (
        <div className="mt-4">
          <p>Uploading to S3... {uploadProgress}%</p>
        </div>
      )}

      {uploadedFileUrl && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800">File uploaded successfully!</p>
          <a
            href={uploadedFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {uploadedFileUrl}
          </a>
        </div>
      )}
    </div>
  )
}
