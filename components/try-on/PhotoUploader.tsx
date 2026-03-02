'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface PhotoUploaderProps {
  onPhotoUpload: (photoUrl: string) => void;
}

export function PhotoUploader({ onPhotoUpload }: PhotoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<HTMLVideoElement>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 },
      });
      setStream(mediaStream);
      setShowWebcam(true);
      if (webcamRef.current) {
        webcamRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Webcam error:', error);
      alert('Could not access webcam. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (!webcamRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = webcamRef.current.videoWidth;
    canvas.height = webcamRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(webcamRef.current, 0, 0);
      const photoUrl = canvas.toDataURL('image/jpeg');
      setPreview(photoUrl);
      stopWebcam();
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowWebcam(false);
  };

  const handleContinue = () => {
    if (preview) {
      onPhotoUpload(preview);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-2">Upload Your Photo</h2>
        <p className="text-muted-foreground mb-6">
          For best results, use a clear, full-body photo with good lighting
        </p>

        {!preview && !showWebcam && (
          <>
            {/* Drag & Drop Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
              }`}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Drag & drop your photo here</p>
              <p className="text-sm text-muted-foreground mb-4">or</p>
              <Button onClick={() => fileInputRef.current?.click()}>
                Choose File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
            </div>

            {/* Webcam Option */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">Or use your camera</p>
              <Button variant="outline" onClick={startWebcam} className="gap-2">
                <Camera className="h-4 w-4" />
                Open Camera
              </Button>
            </div>
          </>
        )}

        {/* Webcam View */}
        {showWebcam && (
          <div className="space-y-4">
            <div className="relative aspect-[3/4] bg-black rounded-lg overflow-hidden">
              <video
                ref={webcamRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={capturePhoto} className="flex-1">
                <Camera className="h-4 w-4 mr-2" />
                Capture Photo
              </Button>
              <Button variant="outline" onClick={stopWebcam}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Preview */}
        {preview && (
          <div className="space-y-4">
            <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt="Your photo"
                fill
                className="object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => setPreview(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleContinue} className="w-full" size="lg">
              Continue to Select Clothing
            </Button>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">Tips for best results:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Stand straight facing the camera</li>
            <li>• Use good lighting (natural light works best)</li>
            <li>• Wear fitted clothing to show your body shape</li>
            <li>• Keep arms slightly away from body</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
