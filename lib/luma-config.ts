/**
 * Luma configuration loader
 *
 * Luma API docs: https://docs.luma.com/reference/getting-started-with-your-api
 * Base URL: https://public-api.luma.com
 * Auth header: x-luma-api-key
 */

export type LumaConfig = {
  apiKey?: string;
  baseUrl: string;
};

export function loadLumaConfig(): LumaConfig {
  return {
    apiKey: process.env.LUMA_API_KEY,
    baseUrl: process.env.LUMA_BASE_URL || "https://public-api.luma.com",
  };
}
