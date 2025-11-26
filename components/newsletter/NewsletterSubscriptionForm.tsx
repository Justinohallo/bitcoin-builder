"use client";

import { useState, FormEvent } from "react";

interface NewsletterSubscriptionFormProps {
  source?: string;
  className?: string;
  showSuccessMessage?: boolean;
}

export function NewsletterSubscriptionForm({
  source,
  className = "",
  showSuccessMessage = true,
}: NewsletterSubscriptionFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, source }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setStatus("success");
      setEmail(""); // Clear form on success

      // Reset success message after 5 seconds
      if (showSuccessMessage) {
        setTimeout(() => {
          setStatus("idle");
        }, 5000);
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to subscribe"
      );
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={status === "loading"}
            className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="px-6 py-3 bg-orange-400 text-neutral-950 font-bold rounded-lg hover:bg-orange-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {status === "loading"
              ? "Subscribing..."
              : status === "success"
                ? "Subscribed!"
                : "Subscribe"}
          </button>
        </div>

        {status === "error" && errorMessage && (
          <div className="px-4 py-3 bg-red-950/50 border border-red-800 rounded-lg text-red-200 text-sm">
            {errorMessage}
          </div>
        )}

        {status === "success" && showSuccessMessage && (
          <div className="px-4 py-3 bg-green-950/50 border border-green-800 rounded-lg text-green-200 text-sm">
            Successfully subscribed! Check your email for confirmation.
          </div>
        )}
      </form>

      <p className="text-xs text-neutral-500 mt-3">
        We'll send you updates about events, recaps, and Bitcoin community news.
        You can unsubscribe at any time.
      </p>
    </div>
  );
}
