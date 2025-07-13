'use client'

import { useState } from 'react'
import { UploadDropzone } from '@/lib/uploadthing'
import { X, Camera } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  onUpload: (urls: string[]) => void
  existingImages?: string[]
  maxImages?: number
}

export function ImageUpload({ onUpload, existingImages = [], maxImages = 5 }: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>(existingImages)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = (res: Array<{ url: string }>) => {
    const newUrls = res.map((file) => file.url)
    const allImages = [...uploadedImages, ...newUrls]
    setUploadedImages(allImages)
    onUpload(allImages)
    setIsUploading(false)
  }

  const removeImage = (indexToRemove: number) => {
    const filtered = uploadedImages.filter((_, index) => index !== indexToRemove)
    setUploadedImages(filtered)
    onUpload(filtered)
  }

  const remainingSlots = maxImages - uploadedImages.length

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Camera className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-gray-800">
          📸 Show Off This Cattle Guard!
        </h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Upload some epic photos of this cattle guard! Fellow enthusiasts want to see what they&apos;re missing. 
        Max {maxImages} photos, because we believe in quality over quantity! 🌟
      </p>

      {/* Existing Images */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {uploadedImages.map((url, index) => (
            <div key={index} className="relative group">
              <Image
                src={url}
                alt={`Cattle guard photo ${index + 1}`}
                width={200}
                height={200}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {remainingSlots > 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          {!isUploading ? (
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={handleUpload}
              onUploadBegin={() => setIsUploading(true)}
              onUploadError={(error: Error) => {
                console.error('Upload error:', error)
                setIsUploading(false)
                alert('Upload failed! Please try again.')
              }}
              appearance={{
                container: "border-none p-0",
                uploadIcon: "text-blue-500",
                label: "text-gray-700 font-medium",
                allowedContent: "text-gray-500 text-sm",
                button: "bg-blue-500 hover:bg-blue-600 px-6 py-2 text-sm font-medium"
              }}
              content={{
                label: `📷 Drop your cattle guard pics here! (${remainingSlots} remaining)`,
                allowedContent: "Images up to 4MB",
                button: "Choose Files"
              }}
            />
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Uploading your awesome photos... 🚀</p>
            </div>
          )}
        </div>
      )}

      {uploadedImages.length >= maxImages && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-yellow-800 text-sm">
            🎉 Photo limit reached! You&apos;ve captured this cattle guard in all its glory!
          </p>
        </div>
      )}
    </div>
  )
}