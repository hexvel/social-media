"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface FullScreenImageProps {
  url: string;
  onClose: () => void;
}

export default function FullScreenImage({
  url,
  onClose,
}: FullScreenImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 500);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-500 ${
        loaded && !closing ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`pointer-events-none relative flex h-full max-h-screen w-full max-w-screen-lg transform select-none items-center justify-center transition-transform duration-300 ease-in-out ${
          loaded && !closing ? "scale-100" : "scale-0"
        }`}
      >
        <Image
          src={url}
          alt="Full Screen"
          width={500}
          height={500}
          className="rounded-2xl object-cover"
          onLoadingComplete={() => setLoaded(true)}
        />
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full bg-black bg-opacity-50 p-2 text-white"
        >
          <X />
        </button>
      </div>
    </div>
  );
}
