"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeDisplayProps {
  url: string;
}

/**
 * Client component for QR code display with mobile detection
 * Uses the current page URL dynamically for real-time QR code generation
 */
export function QRCodeDisplay({ url }: QRCodeDisplayProps) {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Use the actual current page URL
    setCurrentUrl(window.location.href);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Builder Vancouver",
          text: "Check out Builder Vancouver - Bitcoin Meetups & Education",
          url: currentUrl,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log("Share cancelled");
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-neutral-100 mb-6">
        Share This Page
      </h2>
      
      {/* QR Code Container */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <QRCodeSVG
          value={currentUrl}
          size={isMobile ? 200 : 256}
          level="H"
          includeMargin={true}
          fgColor="#000000"
          bgColor="#ffffff"
        />
      </div>

      {/* URL Display */}
      <div className="w-full max-w-md">
        <p className="text-sm text-neutral-400 mb-2 text-center">
          Current URL:
        </p>
        <div className="bg-neutral-950 rounded-lg p-3 border border-neutral-700">
          <p className="text-xs text-neutral-300 break-all text-center font-mono">
            {currentUrl}
          </p>
        </div>
      </div>

      {/* Share Button for Mobile */}
      {isMobile && typeof navigator !== "undefined" && "share" in navigator && (
        <button
          onClick={handleShare}
          className="mt-6 px-6 py-3 bg-orange-400 text-neutral-950 font-semibold rounded-lg hover:bg-orange-300 transition-colors shadow-lg"
        >
          Share Page
        </button>
      )}
    </div>
  );
}
