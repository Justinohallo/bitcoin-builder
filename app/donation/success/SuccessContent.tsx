"use client";

import Link from "next/link";

import { useCheckoutSuccess } from "@moneydevkit/nextjs";

interface SuccessContentProps {
  thankYouMessage: string;
}

export function SuccessContent({ thankYouMessage }: SuccessContentProps) {
  const { isCheckoutPaidLoading, isCheckoutPaid, metadata } =
    useCheckoutSuccess();

  if (isCheckoutPaidLoading || isCheckoutPaid === null) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-400 border-t-transparent mb-4" />
        <p className="text-xl text-neutral-300">Verifying your donation...</p>
      </div>
    );
  }

  if (!isCheckoutPaid) {
    return (
      <div className="text-center py-12">
        <div className="inline-block mb-4">
          <svg
            className="w-16 h-16 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-neutral-100 mb-4">
          Payment Not Confirmed
        </h2>
        <p className="text-neutral-300 mb-6">
          We couldn&apos;t confirm your payment. If you believe this is an
          error, please contact us.
        </p>
        <Link
          href="/donation"
          className="inline-block px-6 py-3 bg-orange-400 text-neutral-950 font-semibold rounded-lg hover:bg-orange-300 transition-colors"
        >
          Try Again
        </Link>
      </div>
    );
  }

  const donationAmount = metadata?.donationAmount as number | undefined;

  return (
    <div className="text-center py-12">
      <div className="inline-block mb-4">
        <svg
          className="w-16 h-16 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-orange-400 mb-4">Thank You!</h2>
      {donationAmount && (
        <p className="text-2xl text-neutral-100 mb-4">
          You donated{" "}
          <span className="font-semibold text-orange-300">
            {donationAmount.toLocaleString()} sats
          </span>
        </p>
      )}
      <p className="text-neutral-300 mb-8 max-w-md mx-auto">{thankYouMessage}</p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-neutral-800 text-neutral-100 font-semibold rounded-lg hover:bg-neutral-700 transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/donation"
          className="inline-block px-6 py-3 bg-orange-400 text-neutral-950 font-semibold rounded-lg hover:bg-orange-300 transition-colors"
        >
          Donate Again
        </Link>
      </div>
    </div>
  );
}
