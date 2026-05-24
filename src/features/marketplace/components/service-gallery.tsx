"use client";

import { useState } from "react";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ServiceGalleryProps {
  serviceId: string;
  serviceName: string;
}

export function ServiceGallery({ serviceId, serviceName }: ServiceGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Placeholder images - à remplacer par vraies images plus tard
  const images = [
    `https://placehold.co/800x600/6366f1/white?text=${encodeURIComponent(serviceName)}`,
    `https://placehold.co/800x600/8b5cf6/white?text=Image+2`,
    `https://placehold.co/800x600/ec4899/white?text=Image+3`,
  ];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-muted">
        <img src={images[currentIndex]} alt={`${serviceName} - Image ${currentIndex + 1}`} className="h-full w-full object-cover" />

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full"
              onClick={handlePrevious}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color="currentColor" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
              onClick={handleNext}
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="currentColor" />
            </Button>

            {/* Indicateurs */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentIndex ? "bg-white w-4" : "bg-white/50"
                  }`}
                  aria-label={`Aller à l'image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Miniatures */}
      {images.length > 1 && (
        <div className="flex gap-2 p-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                index === currentIndex ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={image} alt={`Miniature ${index + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
