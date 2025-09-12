import { useState, useCallback } from 'react';
import { Upload, Camera, X, Loader2 } from 'lucide-react';
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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onImageUpload(imageFile);
      console.log('Receipt uploaded via drag and drop:', imageFile.name);
    }
  }, [onImageUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
      console.log('Receipt uploaded via file input:', file.name);
    }
  }, [onImageUpload]);

  if (uploadedImage) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="p-6">
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
                className="absolute top-2 right-2"
                onClick={onRemoveImage}
                data-testid="button-remove-image"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="flex items-center space-x-2 text-white">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Processing receipt...</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`w-full max-w-lg mx-auto transition-colors ${
        isDragOver ? 'border-primary bg-primary/5' : 'border-dashed border-2'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid="card-upload-zone"
    >
      <CardContent className="p-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Upload Your Receipt</h3>
            <p className="text-muted-foreground">
              Drag and drop your grocery receipt here, or click to browse
            </p>
          </div>

          <div className="space-y-3">
            <label htmlFor="receipt-upload">
              <Button asChild className="cursor-pointer" data-testid="button-browse-files">
                <span>
                  <Camera className="h-4 w-4 mr-2" />
                  Browse Files
                </span>
              </Button>
              <input
                id="receipt-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                data-testid="input-file-upload"
              />
            </label>
            
            <p className="text-xs text-muted-foreground">
              Supports JPG, PNG, and other image formats
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}