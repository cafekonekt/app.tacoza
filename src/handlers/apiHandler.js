"use server";
// Base URL of the API, use environment variable
const BASE_URL = process.env.SERVER_URL || "http://localhost:8000";
// const BASE_URL = "https://api.tacoza.co";

// Default headers for all requests
const defaultHeaders = {
  "Content-Type": "application/json",
  "cache": "no-store",
};

/**
 * Custom error class to handle HTTP errors
 */
class HttpError extends Error {
  constructor(status, statusText, url) {
    super(`HTTP Error: ${status} ${statusText} for URL ${url}`);
    this.status = status;
    this.statusText = statusText;
    this.url = url;
  }
}

/**
 * Utility function to make API requests
 * @param {string} endpoint - The API endpoint to call
 * @param {object} options - Fetch options including method, headers, body, etc.
 * @param {number} timeout - Timeout in milliseconds (default: 10000ms)
 * @returns {Promise<any>} - A promise that resolves to the response data or custom status handling
 */
const apiRequest = async (endpoint, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    signal: controller.signal,
  };
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    if (response.status === 401) {
      throw new HttpError(401, "Unauthorized", response.url);
    }
    if (response.status === 404) {
      throw new HttpError(404, "Not Found", response.url);
    }
    if (response.status === 200 || response.status === 201) {
      return await response.json();
    }
    throw new HttpError(response.status, response.statusText, response.url);
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Request timed out:", error);
      throw new Error("Request timed out");
    } else if (error instanceof HttpError) {
      return { error: error.message, status: error.status };
    } else {
      console.error("Unexpected Error:", error);
      throw new Error("An unexpected error occurred");
    }
  } finally {
    clearTimeout(id);
  }
};

/**
 * Helper functions for specific HTTP methods
 */
const apiGet = (endpoint, options = {}) =>
  apiRequest(endpoint, { method: "GET", ...options });

const apiPost = (endpoint, body, options = {}) =>
  apiRequest(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
    ...options,
  });

const apiPut = (endpoint, body, options = {}) =>
  apiRequest(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
    ...options,
  });

const apiDelete = (endpoint, options = {}) =>
  apiRequest(endpoint, { method: "DELETE", ...options });

export { apiGet, apiPost, apiPut, apiDelete };
