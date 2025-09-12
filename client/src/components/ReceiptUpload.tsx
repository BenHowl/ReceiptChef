import { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, Camera, X, Loader2, RotateCcw, ImageIcon, Smartphone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ReceiptUploadProps {
  onImageUpload: (file: File) => void;
  isProcessing?: boolean;
  uploadedImage?: string | null;
  onRemoveImage?: () => void;
}

export default function ReceiptUpload({ 
  onImageUpload, 
  isProcessing = false, 
  uploadedImage,
  onRemoveImage 
}: ReceiptUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCameraMode, setIsCameraMode] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraSupported, setIsCameraSupported] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check camera support on mount
  useEffect(() => {
    const checkCameraSupport = () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsCameraSupported(false);
      }
    };
    checkCameraSupport();
  }, []);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Image compression utility
  const compressImage = useCallback((file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        const maxWidth = 1600;
        const maxHeight = 1600;
        let { width, height } = img;
        
        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.8
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setIsCameraMode(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera access failed:', error);
      setCameraError('Camera access denied or not available');
      setIsCameraSupported(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraMode(false);
    setCapturedImage(null);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    ctx.drawImage(video, 0, 0);
    
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageDataUrl);
  }, []);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
  }, []);

  const confirmPhoto = useCallback(async () => {
    if (!capturedImage) return;
    
    // Convert data URL to blob and create file
    const response = await fetch(capturedImage);
    const blob = await response.blob();
    const file = new File([blob], `receipt-${Date.now()}.jpg`, { type: 'image/jpeg' });
    
    // Compress and upload
    const compressedFile = await compressImage(file);
    onImageUpload(compressedFile);
    console.log('Receipt captured via camera:', compressedFile.name);
    
    stopCamera();
  }, [capturedImage, compressImage, onImageUpload, stopCamera]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      const compressedFile = await compressImage(imageFile);
      onImageUpload(compressedFile);
      console.log('Receipt uploaded via drag and drop:', compressedFile.name);
    }
  }, [compressImage, onImageUpload]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const compressedFile = await compressImage(file);
      onImageUpload(compressedFile);
      console.log('Receipt uploaded via file input:', compressedFile.name);
    }
  }, [compressImage, onImageUpload]);

  // Show uploaded image with processing overlay
  if (uploadedImage) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-4 md:p-6">
          <div className="relative">
            <img 
              src={uploadedImage} 
              alt="Uploaded receipt" 
              className="w-full h-auto rounded-lg shadow-md"
              data-testid="img-uploaded-receipt"
            />
            {!isProcessing && onRemoveImage && (
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-8 w-8 md:h-10 md:w-10"
                onClick={onRemoveImage}
                data-testid="button-remove-image"
              >
                <X className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            )}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="flex items-center space-x-2 text-white">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-sm">Processing receipt...</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Camera mode with captured photo
  if (isCameraMode && capturedImage) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={capturedImage} 
                alt="Captured receipt" 
                className="w-full h-auto rounded-lg"
                data-testid="img-captured-receipt"
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={retakePhoto}
                variant="outline"
                className="flex-1 h-12"
                data-testid="button-retake-photo"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake
              </Button>
              <Button 
                onClick={confirmPhoto}
                className="flex-1 h-12"
                data-testid="button-confirm-photo"
              >
                <Upload className="h-4 w-4 mr-2" />
                Use Photo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Camera mode - live view
  if (isCameraMode && stream) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full aspect-[4/3] object-cover"
                data-testid="video-camera-preview"
              />
              
              {/* Camera overlay guides */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-4 border-2 border-white/50 rounded-lg"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm bg-black/50 px-2 py-1 rounded">
                  Center receipt in frame
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Button 
                onClick={stopCamera}
                variant="outline"
                size="icon"
                className="h-12 w-12"
                data-testid="button-close-camera"
              >
                <X className="h-5 w-5" />
              </Button>
              
              <Button 
                onClick={capturePhoto}
                size="icon"
                className="h-16 w-16 rounded-full bg-white hover:bg-gray-100 text-black border-4 border-primary"
                data-testid="button-capture-photo"
              >
                <Camera className="h-8 w-8" />
              </Button>
              
              <div className="w-12" /> {/* Spacer for centering */}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Main upload interface
  return (
    <Card 
      className={`w-full max-w-md mx-auto transition-colors ${
        isDragOver ? 'border-primary bg-primary/5' : 'border-dashed border-2'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid="card-upload-zone"
    >
      <CardContent className="p-6 md:p-8">
        <div className="text-center space-y-4 md:space-y-6">
          <div className="flex justify-center">
            <div className="p-3 md:p-4 rounded-full bg-primary/10">
              <Upload className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg md:text-xl font-semibold">Upload Your Receipt</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Take a photo or upload an image of your grocery receipt
            </p>
            {cameraError && (
              <p className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                {cameraError}
              </p>
            )}
          </div>

          <div className="space-y-3 md:space-y-4">
            {/* Camera Button */}
            {isCameraSupported && (
              <Button
                onClick={startCamera}
                className="w-full h-12 text-base"
                data-testid="button-open-camera"
              >
                <Camera className="h-5 w-5 mr-2" />
                Take Photo
              </Button>
            )}
            
            {/* File Upload Button */}
            <label htmlFor="receipt-upload" className="block">
              <Button 
                asChild 
                variant={isCameraSupported ? "outline" : "default"}
                className="w-full h-12 text-base cursor-pointer" 
                data-testid="button-browse-files"
              >
                <span>
                  <ImageIcon className="h-5 w-5 mr-2" />
                  {isCameraSupported ? "Browse Files" : "Upload Image"}
                </span>
              </Button>
              <input
                id="receipt-upload"
                type="file"
                accept="image/*"
                capture={isCameraSupported ? undefined : "environment"}
                className="hidden"
                onChange={handleFileSelect}
                data-testid="input-file-upload"
              />
            </label>
            
            <p className="text-xs text-muted-foreground">
              {isCameraSupported ? (
                <>
                  <Smartphone className="h-3 w-3 inline mr-1" />
                  Best results with good lighting and clear text
                </>
              ) : (
                "Supports JPG, PNG, and other image formats"
              )}
            </p>
          </div>
        </div>
      </CardContent>
      
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </Card>
  );
}