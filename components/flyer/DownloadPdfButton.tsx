"use client";

export function DownloadPdfButton({ slug }: { slug: string }) {
  const handleDownload = () => {
    window.location.href = `/api/events/${slug}/flyer/pdf`;
  };

  return (
    <button onClick={handleDownload} className="flyer-download-btn">
      Download PDF
    </button>
  );
}
