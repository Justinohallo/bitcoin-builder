/**
 * Newsletter Subscription Service
 * Handles storage and management of newsletter subscriptions
 */

import { randomBytes } from "crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

import {
  NewsletterSubscriptionSchema,
  NewsletterSubscriptionsCollectionSchema,
} from "@/lib/schemas";
import type { NewsletterSubscription } from "@/lib/types";

const SUBSCRIPTIONS_FILE = join(
  process.cwd(),
  "content",
  "newsletter-subscriptions.json"
);

/**
 * Generate a unique unsubscribe token
 */
export function generateUnsubscribeToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Load all subscriptions from storage
 */
export function loadSubscriptions(): NewsletterSubscription[] {
  if (!existsSync(SUBSCRIPTIONS_FILE)) {
    // Create empty subscriptions file if it doesn't exist
    const emptyCollection = { subscriptions: [] };
    writeFileSync(
      SUBSCRIPTIONS_FILE,
      JSON.stringify(emptyCollection, null, 2),
      "utf-8"
    );
    return [];
  }

  try {
    const fileContent = readFileSync(SUBSCRIPTIONS_FILE, "utf-8");
    const data = JSON.parse(fileContent);
    const validated = NewsletterSubscriptionsCollectionSchema.parse(data);
    return validated.subscriptions;
  } catch (error) {
    console.error("Error loading subscriptions:", error);
    throw new Error("Failed to load newsletter subscriptions");
  }
}

/**
 * Save subscriptions to storage
 */
function saveSubscriptions(subscriptions: NewsletterSubscription[]): void {
  try {
    // Ensure content directory exists
    const contentDir = join(process.cwd(), "content");
    if (!existsSync(contentDir)) {
      mkdirSync(contentDir, { recursive: true });
    }

    const collection = { subscriptions };
    writeFileSync(
      SUBSCRIPTIONS_FILE,
      JSON.stringify(collection, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Error saving subscriptions:", error);
    throw new Error("Failed to save newsletter subscriptions");
  }
}

/**
 * Add a new subscription
 */
export function addSubscription(
  email: string,
  source?: string
): NewsletterSubscription {
  const subscriptions = loadSubscriptions();

  // Check if email already exists
  const existing = subscriptions.find(
    (sub) => sub.email.toLowerCase() === email.toLowerCase()
  );

  if (existing) {
    if (existing.status === "active") {
      throw new Error("Email is already subscribed");
    }
    // Re-subscribe if previously unsubscribed
    existing.status = "active";
    existing.subscribedAt = new Date().toISOString();
    existing.unsubscribeToken = generateUnsubscribeToken();
    if (source) {
      existing.source = source;
    }
    saveSubscriptions(subscriptions);
    return existing;
  }

  // Create new subscription
  const newSubscription: NewsletterSubscription = {
    email: email.toLowerCase(),
    subscribedAt: new Date().toISOString(),
    status: "active",
    unsubscribeToken: generateUnsubscribeToken(),
    source,
  };

  subscriptions.push(newSubscription);
  saveSubscriptions(subscriptions);

  return newSubscription;
}

/**
 * Unsubscribe an email address
 */
export function unsubscribeEmail(
  email: string,
  token: string
): NewsletterSubscription | null {
  const subscriptions = loadSubscriptions();
  const subscription = subscriptions.find(
    (sub) =>
      sub.email.toLowerCase() === email.toLowerCase() &&
      sub.unsubscribeToken === token
  );

  if (!subscription) {
    return null;
  }

  subscription.status = "unsubscribed";
  saveSubscriptions(subscriptions);

  return subscription;
}

/**
 * Unsubscribe by token only (for unsubscribe links)
 */
export function unsubscribeByToken(token: string): NewsletterSubscription | null {
  const subscriptions = loadSubscriptions();
  const subscription = subscriptions.find(
    (sub) => sub.unsubscribeToken === token && sub.status === "active"
  );

  if (!subscription) {
    return null;
  }

  subscription.status = "unsubscribed";
  saveSubscriptions(subscriptions);

  return subscription;
}

/**
 * Get subscription by email
 */
export function getSubscriptionByEmail(
  email: string
): NewsletterSubscription | null {
  const subscriptions = loadSubscriptions();
  return (
    subscriptions.find(
      (sub) => sub.email.toLowerCase() === email.toLowerCase()
    ) || null
  );
}

/**
 * Get all active subscriptions
 */
export function getActiveSubscriptions(): NewsletterSubscription[] {
  const subscriptions = loadSubscriptions();
  return subscriptions.filter((sub) => sub.status === "active");
}

/**
 * Get subscription count
 */
export function getSubscriptionCount(): number {
  return getActiveSubscriptions().length;
}
