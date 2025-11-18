"use client";

import styles from "@/app/events/[slug]/flyer/flyer.module.css";

export function DownloadPdfButton({ slug }: { slug: string }) {
  const handleDownload = () => {
    window.location.href = `/api/events/${slug}/flyer/pdf`;
  };

  return (
    <button onClick={handleDownload} className={styles.flyerDownloadBtn}>
      Download PDF
    </button>
  );
}
