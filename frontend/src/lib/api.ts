/**
 * WordPress REST API Utility
 * 
 * Centralized fetch provider for interactions with the headless WordPress backend.
 */

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || "http://icibangoua.local/wp-json/wp/v2";

interface FetchWPParams {
  endpoint: string;
  options?: RequestInit;
  params?: Record<string, string | number>;
  baseUrl?: string;
}

export async function fetchWP({ endpoint, options = {}, params, baseUrl }: FetchWPParams & { baseUrl?: string }) {
  const base = baseUrl || WP_API_URL;
  let url = `${base}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  // Next.js 'force-cache' is default. Can be overridden in options. // 'no-store' for dynamic routes
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
        throw new Error(`WordPress API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetchWP error:", error);
    throw error;
  }
}

/**
 * Helper to fetch LMS Modules
 */
export async function getLmsModules(params?: Record<string, string | number>) {
    return fetchWP({ 
        endpoint: "/lms_module", 
        params: { _embed: 1, ...params },
        options: { next: { revalidate: 60 } } 
    });
}

/**
 * Helper to fetch a single LMS Module by slug
 */
export async function getLmsModuleBySlug(slug: string) {
    const modules = await fetchWP({ 
        endpoint: "/lms_module", 
        params: { slug, _embed: 1 }, 
        options: { next: { revalidate: 60 } } 
    });
    return modules[0] || null;
}

/**
 * Helper to fetch Civic Media 
 */
export async function getCivicMedia(params?: Record<string, string | number>) {
    return fetchWP({ 
        endpoint: "/civic_media", 
        params: { _embed: 1, ...params },
        options: { next: { revalidate: 60 } } 
    });
}

/**
 * Helper to fetch Public News
 */
export async function getPublicNews(params?: Record<string, string | number>) {
    return fetchWP({ 
        endpoint: "/public_news", 
        params: { _embed: 1, ...params },
        options: { next: { revalidate: 60 } } 
    });
}
/**
 * Helper to fetch standard Blog Posts
 */
export async function getPosts(params?: Record<string, string | number>) {
    return fetchWP({ 
        endpoint: "/posts", 
        params: { _embed: 1, ...params }, 
        options: { next: { revalidate: 60 } } 
    });
}

/**
 * Helper to fetch a single standard Blog Post by slug
 */
export async function getPostBySlug(slug: string) {
    const posts = await fetchWP({ 
        endpoint: "/posts", 
        params: { slug, _embed: 1 }, 
        options: { next: { revalidate: 60 } } 
    });
    return posts[0] || null;
}

/**
 * Authentication Helper: Login
 */
export async function loginUser(credentials: Record<string, string>) {
    const customBase = process.env.NEXT_PUBLIC_WP_API_URL?.replace('/wp/v2', '/icibangoua/v1') 
                   || "http://icibangoua.local/wp-json/icibangoua/v1";
                   
    return fetchWP({
        endpoint: "/login",
        baseUrl: customBase,
        options: {
            method: "POST",
            body: JSON.stringify(credentials),
            cache: 'no-store'
        }
    });
}

/**
 * Authentication Helper: Register
 */
export async function registerUser(userData: Record<string, string>) {
    const customBase = process.env.NEXT_PUBLIC_WP_API_URL?.replace('/wp/v2', '/icibangoua/v1') 
                   || "http://icibangoua.local/wp-json/icibangoua/v1";
                   
    return fetchWP({
        endpoint: "/register",
        baseUrl: customBase,
        options: {
            method: "POST",
            body: JSON.stringify(userData),
            cache: 'no-store'
        }
    });
}

