"use client";

import { useState } from "react";

import { X_MAX_CHARACTERS } from "@/lib/constants";
import type { PostResponse } from "@/lib/types";

/**
 * Social Media Post Form Component
 * Allows users to post content to X and/or Nostr platforms
 */
export function PostForm() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PostResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [platforms, setPlatforms] = useState<("x" | "nostr")[]>(["x", "nostr"]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/social-media/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          platforms,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to post");
        return;
      }

      const data: PostResponse = await response.json();
      setResult(data);

      // Clear form on success
      if (data.allSuccessful) {
        setContent("");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const characterCount = content.length;
  const isOverLimit = characterCount > X_MAX_CHARACTERS;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-neutral-900 border border-neutral-800 rounded-lg">
      <h2 className="text-2xl font-semibold text-neutral-100 mb-4">
        Post to Social Media
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Platform Selection */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-neutral-300">
            <input
              type="checkbox"
              checked={platforms.includes("x")}
              onChange={(e) => {
                if (e.target.checked) {
                  setPlatforms([...platforms, "x"]);
                } else {
                  setPlatforms(platforms.filter((p) => p !== "x"));
                }
              }}
              className="w-4 h-4 text-orange-400 border-neutral-600 rounded focus:ring-orange-400"
            />
            <span>X (Twitter)</span>
          </label>
          <label className="flex items-center gap-2 text-neutral-300">
            <input
              type="checkbox"
              checked={platforms.includes("nostr")}
              onChange={(e) => {
                if (e.target.checked) {
                  setPlatforms([...platforms, "nostr"]);
                } else {
                  setPlatforms(platforms.filter((p) => p !== "nostr"));
                }
              }}
              className="w-4 h-4 text-orange-400 border-neutral-600 rounded focus:ring-orange-400"
            />
            <span>Nostr</span>
          </label>
        </div>

        {/* Textarea */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={X_MAX_CHARACTERS}
            placeholder="What's happening?"
            rows={6}
            className={`w-full p-4 bg-neutral-950 border rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
              isOverLimit
                ? "border-red-500"
                : "border-neutral-700 focus:border-orange-400"
            }`}
          />
          <div
            className={`text-sm mt-1 text-right ${
              isOverLimit ? "text-red-500" : "text-neutral-400"
            }`}
          >
            {characterCount}/{X_MAX_CHARACTERS} characters
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            loading || !content.trim() || platforms.length === 0 || isOverLimit
          }
          className="w-full px-6 py-3 bg-orange-400 text-neutral-950 font-semibold rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Posting..." : `Post to ${platforms.join(" & ")}`}
        </button>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-950 border border-red-800 rounded-lg">
          <p className="text-red-400 font-semibold">Error</p>
          <p className="text-red-300 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="mt-4 space-y-2">
          <p
            className={`font-semibold ${
              result.allSuccessful ? "text-green-400" : "text-yellow-400"
            }`}
          >
            {result.allSuccessful ? "Posted successfully!" : "Partial success"}
          </p>
          {result.results.map((platformResult, index) => (
            <div
              key={index}
              className={`p-3 rounded border ${
                platformResult.success
                  ? "bg-green-950 border-green-800"
                  : "bg-red-950 border-red-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-200 capitalize">
                  {platformResult.platform}:
                </span>
                <span
                  className={
                    platformResult.success ? "text-green-400" : "text-red-400"
                  }
                >
                  {platformResult.success ? "Success" : "Failed"}
                </span>
              </div>
              {platformResult.success && platformResult.url && (
                <a
                  href={platformResult.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-orange-400 hover:text-orange-300 mt-1 block"
                >
                  View post →
                </a>
              )}
              {platformResult.error && (
                <p className="text-sm text-red-300 mt-1">
                  {platformResult.error}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
