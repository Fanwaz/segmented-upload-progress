# Segmented Progress Bar Component Guide

This guide explains how to use the segmented progress bar component for file uploads in your SaaS applications.

## Table of Contents

1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
3. [Props & Customization](#props--customization)
4. [Real-World Integration](#real-world-integration)
5. [Examples](#examples)
6. [Best Practices](#best-practices)

## Installation

### Step 1: Copy the Component Files

Copy the `file-upload-progress.tsx` file into your project's components directory.

### Step 2: Install Dependencies

The component uses minimal dependencies, but make sure you have the following installed:

\`\`\`bash
npm install lucide-react
# or
yarn add lucide-react
\`\`\`

## Basic Usage

Here's how to use the component in its simplest form:

\`\`\`tsx
import FileUploadProgress from '@/components/file-upload-progress';

export default function YourPage() {
  return (
    <div className="container mx-auto p-4">
      <h1>Upload Your File</h1>
      <FileUploadProgress 
        onFileSelect={(file) => console.log('Selected file:', file.name)}
      />
    </div>
  );
}
\`\`\`

This will render a file upload button that, when clicked, opens a file selector. After selecting a file, it will show the segmented progress bar with a simulated upload.

## Props & Customization

The component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onFileSelect` | `(file: File) => void` | `undefined` | Callback function that runs when a file is selected |
| `simulateUpload` | `boolean` | `true` | Whether to simulate the upload progress (for demo purposes) |
| `totalSegments` | `number` | `20` | Number of segments in the progress bar |
| `className` | `string` | `""` | Additional CSS classes to apply to the container |

### Customizing the Appearance

You can customize the appearance by modifying the component or passing additional classes:

\`\`\`tsx
<FileUploadProgress 
  className="my-8"
  totalSegments={30} // More segments for a smoother look
/>
\`\`\`

### Customizing Colors

To change the colors, you can modify the component or override the styles with Tailwind classes:

\`\`\`tsx
// Inside the component, change:
<div
  key={index}
  className={`flex-1 rounded-md transition-colors duration-300 ${
    index < filledSegments ? "bg-blue-500" : "bg-gray-300"
  }`}
/>
\`\`\`

## Real-World Integration

For real file uploads, you'll want to handle the actual upload process and track progress. Here's how to integrate with a real upload:

\`\`\`tsx
import FileUploadProgress from '@/components/file-upload-progress';
import { useState } from 'react';

export default function RealUploadExample() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });
      
      xhr.addEventListener('load', () => {
        setIsUploading(false);
        if (xhr.status === 200) {
          console.log('Upload complete!');
        } else {
          console.error('Upload failed');
        }
      });
      
      xhr.open('POST', '/api/upload', true);
      xhr.send(formData);
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
    }
  };
  
  return (
    <div>
      <h1>File Upload</h1>
      <FileUploadProgress 
        onFileSelect={handleFileSelect}
        simulateUpload={false} // Disable simulation
      />
      {isUploading && <p>Uploading: {uploadProgress}%</p>}
    </div>
  );
}
\`\`\`

### Using with Server Actions (Next.js)

For Next.js applications using Server Actions:

\`\`\`tsx
'use client'

import FileUploadProgress from '@/components/file-upload-progress';
import { useState } from 'react';
import { uploadFile } from '@/app/actions';

export default function UploadWithServerAction() {
  const [progress, setProgress] = useState(0);
  
  const handleFileSelect = async (file: File) => {
    // Convert file to ArrayBuffer for server action
    const arrayBuffer = await file.arrayBuffer();
    
    // Create a ReadableStream to track progress
    let loaded = 0;
    const totalSize = file.size;
    
    const updateProgress = () => {
      const progressPercentage = Math.round((loaded / totalSize) * 100);
      setProgress(progressPercentage);
    };
    
    // Simulate progress updates (in a real app, you'd track actual upload progress)
    const progressInterval = setInterval(() => {
      loaded += totalSize / 20; // Simulate 5% increments
      if (loaded > totalSize) {
        loaded = totalSize;
        clearInterval(progressInterval);
      }
      updateProgress();
    }, 200);
    
    try {
      // Call server action to upload file
      await uploadFile({
        name: file.name,
        type: file.type,
        data: arrayBuffer,
      });
      
      clearInterval(progressInterval);
      setProgress(100);
    } catch (error) {
      console.error('Upload failed:', error);
      clearInterval(progressInterval);
    }
  };
  
  return (
    <div>
      <FileUploadProgress 
        onFileSelect={handleFileSelect}
        simulateUpload={false}
      />
    </div>
  );
}
\`\`\`

## Examples

### Basic Upload with Custom Segments

\`\`\`tsx
<FileUploadProgress 
  totalSegments={10} 
  onFileSelect={(file) => console.log(file.name)}
/>
\`\`\`

### Custom Styling

\`\`\`tsx
<FileUploadProgress 
  className="border border-gray-200 rounded-lg p-4 shadow-md"
  totalSegments={15}
/>
\`\`\`

### Multiple Uploaders

\`\`\`tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <h3>Upload Document</h3>
    <FileUploadProgress />
  </div>
  <div>
    <h3>Upload Image</h3>
    <FileUploadProgress />
  </div>
</div>
\`\`\`

## Best Practices

1. **Error Handling**: Always implement proper error handling for file uploads.

2. **File Validation**: Validate file types and sizes before uploading:

\`\`\`tsx
const handleFileSelect = (file: File) => {
  // Check file size (e.g., max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('File is too large. Maximum size is 5MB.');
    return;
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    alert('Invalid file type. Please upload a JPEG, PNG, or PDF file.');
    return;
  }
  
  // Proceed with upload
  startUpload(file);
};
\`\`\`

3. **Accessibility**: Ensure your upload component is accessible:

\`\`\`tsx
<label htmlFor="file-input" className="sr-only">Choose file</label>
<input 
  id="file-input"
  type="file"
  aria-describedby="file-input-help"
  onChange={handleFileChange}
/>
<p id="file-input-help" className="text-sm text-gray-500">
  Select a file to upload (max 5MB)
</p>
\`\`\`

4. **Progress Feedback**: Always provide clear feedback during uploads.

5. **Resumable Uploads**: For large files, consider implementing resumable uploads using libraries like Tus or Uppy.

---

Feel free to modify and extend this component to suit your specific SaaS application needs!
\`\`\`

Let me also add a quick implementation example for integrating with AWS S3:
