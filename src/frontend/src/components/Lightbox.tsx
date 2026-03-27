import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

export interface GalleryPhoto {
  src: string;
  title: string;
}

interface LightboxProps {
  photos: GalleryPhoto[];
  currentIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Lightbox({
  photos,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const photo = currentIndex !== null ? photos[currentIndex] : null;

  useEffect(() => {
    if (currentIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [currentIndex, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {currentIndex !== null && photo && (
        <motion.div
          data-ocid="gallery.modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Button
            data-ocid="gallery.close_button"
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10 z-10"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </Button>

          {photos.length > 1 && (
            <>
              <Button
                data-ocid="gallery.pagination_prev"
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev();
                }}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button
                data-ocid="gallery.pagination_next"
                variant="ghost"
                size="icon"
                className="absolute right-14 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          <motion.div
            className="max-w-5xl max-h-[90vh] flex flex-col items-center gap-4 px-16"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={photo.src}
              alt={photo.title}
              className="max-h-[80vh] max-w-full object-contain rounded-sm shadow-2xl"
            />
            <p className="text-white/80 font-body text-sm tracking-widest uppercase">
              {photo.title}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
