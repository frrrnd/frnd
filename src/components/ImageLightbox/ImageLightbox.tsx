import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ImageLightbox.css";

interface LightboxProps {
  animationDuration?: number;
  closeOnBackdropClick?: boolean;
}

const ImageLightbox: React.FC<LightboxProps> = ({
  animationDuration = 0.2,
  closeOnBackdropClick = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<HTMLImageElement | null>(null);
  const [originalRect, setOriginalRect] = useState<DOMRect | null>(null);
  const [zoomedImageDimensions, setZoomedImageDimensions] = useState<{
    width: number;
    height: number;
    top: number;
    left: number;
  } | null>(null);

  // === Calcular tamanho final respeitando viewport ===
  const calculateZoomedDimensions = useCallback((img: HTMLImageElement) => {
    const viewportWidth = window.innerWidth * 0.95; // margem
    const viewportHeight = window.innerHeight * 0.95;

    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    const aspectRatio = naturalWidth / naturalHeight;

    let finalWidth = naturalWidth;
    let finalHeight = naturalHeight;

    if (finalWidth > viewportWidth) {
      finalWidth = viewportWidth;
      finalHeight = finalWidth / aspectRatio;
    }
    if (finalHeight > viewportHeight) {
      finalHeight = viewportHeight;
      finalWidth = finalHeight * aspectRatio;
    }

    const top = (window.innerHeight - finalHeight) / 2;
    const left = (window.innerWidth - finalWidth) / 2;

    return { width: finalWidth, height: finalHeight, top, left };
  }, []);

  // === Abrir lightbox ===
  const openLightbox = useCallback(
    (img: HTMLImageElement) => {
      setActiveImage(img);
      setOriginalRect(img.getBoundingClientRect());
      setZoomedImageDimensions(calculateZoomedDimensions(img));
      setIsOpen(true);
    },
    [calculateZoomedDimensions]
  );

  // === Fechar lightbox ===
  const closeLightbox = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setActiveImage(null);
      setOriginalRect(null);
      setZoomedImageDimensions(null);
    }, animationDuration * 1000);
  }, [animationDuration]);

  // === Adicionar listener de clique em imagens ===
  useEffect(() => {
    const images = document.querySelectorAll<HTMLImageElement>("img");
    const handleClick = (e: Event) => openLightbox(e.currentTarget as HTMLImageElement);

    images.forEach((img) => img.addEventListener("click", handleClick));
    return () => images.forEach((img) => img.removeEventListener("click", handleClick));
  }, [openLightbox]);

  // === Recalcular dimensões no resize ===
  useEffect(() => {
    if (!isOpen || !activeImage) return;

    const handleResize = () => {
      setZoomedImageDimensions(calculateZoomedDimensions(activeImage));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, activeImage, calculateZoomedDimensions]);

  // === Travar scroll quando aberto ===
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // === Fechar com ESC ===
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, closeLightbox]);

  // === Pegar valores para animar ===
  const getAnimationValues = () => {
    if (!originalRect || !zoomedImageDimensions) return {};

    return {
      initial: {
        top: originalRect.top,
        left: originalRect.left,
        width: originalRect.width,
        height: originalRect.height,
        opacity: 0.9,
      },
      animate: {
        top: zoomedImageDimensions.top,
        left: zoomedImageDimensions.left,
        width: zoomedImageDimensions.width,
        height: zoomedImageDimensions.height,
        opacity: 1,
      },
      exit: {
        top: originalRect.top,
        left: originalRect.left,
        width: originalRect.width,
        height: originalRect.height,
        opacity: 0.9,
      },
    };
  };

  return (
    <AnimatePresence>
      {isOpen && activeImage && (
        <div className="lightbox-overlay">
          {/* Backdrop com fade */}
          <motion.div
            className="lightbox-backdrop"
            onClick={closeOnBackdropClick ? closeLightbox : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: animationDuration * 0.8, ease: "easeOut" }}
          />

          {/* Imagem */}
          <motion.img
            src={activeImage.src}
            alt=""
            className="lightbox-image"
            initial={getAnimationValues().initial}
            animate={getAnimationValues().animate}
            exit={getAnimationValues().exit}
            transition={{ duration: animationDuration, ease: "easeInOut" }}
          />
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImageLightbox;
