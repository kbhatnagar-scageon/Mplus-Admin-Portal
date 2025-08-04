"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Eye, 
  ZoomIn, 
  ZoomOut,
  RotateCw,
  X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PrescriptionViewerProps {
  prescriptions: string[];
  className?: string;
}

export function PrescriptionViewer({ prescriptions, className = "" }: PrescriptionViewerProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!prescriptions || prescriptions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No prescriptions available
      </div>
    );
  }

  const openViewer = (index: number) => {
    setSelectedImage(index);
    setZoom(1);
    setRotation(0);
  };

  const closeViewer = () => {
    setSelectedImage(null);
    setZoom(1);
    setRotation(0);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % prescriptions.length);
      setZoom(1);
      setRotation(0);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? prescriptions.length - 1 : selectedImage - 1);
      setZoom(1);
      setRotation(0);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const downloadImage = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `prescription-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        {prescriptions.length === 1 ? (
          // Single image view
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative group">
                <div className="relative aspect-video">
                  <Image
                    src={prescriptions[0]}
                    alt="Prescription"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openViewer(0)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => downloadImage(prescriptions[0], 0)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Multiple images grid
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Prescriptions</h4>
              <Badge variant="secondary">
                {prescriptions.length} {prescriptions.length === 1 ? 'image' : 'images'}
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {prescriptions.map((prescription, index) => (
                <Card key={index} className="overflow-hidden cursor-pointer group">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="relative aspect-square">
                        <Image
                          src={prescription}
                          alt={`Prescription ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => openViewer(index)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => downloadImage(prescription, index)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs">
                          {index + 1}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Viewer Dialog */}
      {selectedImage !== null && (
        <Dialog open={true} onOpenChange={closeViewer}>
          <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0">
            <DialogHeader className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <DialogTitle>
                  Prescription {selectedImage + 1} of {prescriptions.length}
                </DialogTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[60px] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRotate}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadImage(prescriptions[selectedImage], selectedImage)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={closeViewer}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogHeader>
            
            <div className="flex-1 flex">
              {/* Navigation */}
              {prescriptions.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              {/* Image Display */}
              <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
                <div
                  className="relative transition-transform duration-200 ease-out"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  }}
                >
                  <Image
                    src={prescriptions[selectedImage]}
                    alt={`Prescription ${selectedImage + 1}`}
                    width={800}
                    height={600}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Thumbnail strip for multiple images */}
            {prescriptions.length > 1 && (
              <div className="border-t p-4">
                <div className="flex gap-2 overflow-x-auto">
                  {prescriptions.map((prescription, index) => (
                    <button
                      key={index}
                      onClick={() => openViewer(index)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                        index === selectedImage
                          ? 'border-primary'
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      <Image
                        src={prescription}
                        alt={`Prescription ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}