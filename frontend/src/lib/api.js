import {
  clearStoredSession,
  getStoredAccessToken,
  getStoredRefreshToken,
  storeSession
} from "./session";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api";

const readJson = async (response) => response.json().catch(() => null);

const buildApiError = (response, payload) => {
  const error = new Error(payload?.message || response.statusText || "API request failed");
  error.status = response.status;
  error.details = payload?.details ?? null;
  return error;
};

const fetchJson = async (response) => {
  const payload = await readJson(response);

  if (!response.ok) {
    throw buildApiError(response, payload);
  }

  return payload;
};

const refreshSession = async () => {
  const refreshToken = getStoredRefreshToken();

  if (!refreshToken) {
    return null;
  }

  const response = await fetch(`${API_BASE}/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });

  const payload = await readJson(response);

  if (!response.ok) {
    return null;
  }

  const session = {
    user: payload?.data?.user ?? null,
    accessToken: payload?.data?.accessToken ?? "",
    refreshToken: payload?.data?.refreshToken ?? refreshToken
  };

  storeSession(session);
  return session;
};

export const apiFetch = async (path, options = {}, { auth = true, retryOn401 = true } = {}) => {
  const headers = new Headers(options.headers || {});

  if (auth) {
    const accessToken = getStoredAccessToken();
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  if (options.body && !headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers
    });

    if (response.status === 401 && auth && retryOn401) {
      const refreshed = await refreshSession();
      if (refreshed?.accessToken) {
        return apiFetch(path, options, { auth, retryOn401: false });
      }
    }

    return fetchJson(response);
  } catch (error) {
    console.error(`[API Error] Failed to fetch ${API_BASE}${path}:`, error);
    throw new Error(`Network error: ${error.message}`);
  }
};

export const fetchProducts = async () => {
  console.log("[API] Fetching products from:", API_BASE);
  try {
    const payload = await apiFetch("/products", { method: "GET" }, { auth: false });
    const products = payload.data?.products ?? [];

    return products.map((product) => ({
      id: product._id,
      emoji: product.emoji ?? "📦",
      name: product.name,
      cat: product.cat ?? product.category ?? "General",
      brand: product.brand ?? "Store",
      price: product.price,
      oldPrice: product.oldPrice ?? null,
      stars: Number.isFinite(product.stars) ? product.stars : 4,
      badge: product.badge ?? (product.isActive ? "new" : "sold out"),
      description: product.description ?? "No description available.",
      stock: product.stock ?? 0,
      isActive: product.isActive
    }));
  } catch (error) {
    console.error("[API] Failed to fetch products:", error);
    throw error;
  }
};

export const login = async (credentials) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  const payload = await fetchJson(response);
  const session = {
    user: payload.data?.user ?? null,
    accessToken: payload.data?.accessToken ?? "",
    refreshToken: payload.data?.refreshToken ?? ""
  };

  storeSession(session);

  return {
    ...session,
    message: payload.message
  };
};

export const register = async (data) => {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const payload = await fetchJson(response);
  return {
    user: payload.data?.user ?? null,
    message: payload.message
  };
};

export const logout = async ({ refreshToken }) => {
  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });

  const payload = await readJson(response);
  return {
    success: response.ok,
    message: payload?.message || (response.ok ? "Logged out successfully" : "Logged out locally")
  };
};

export const getCart = async () => apiFetch("/cart", { method: "GET" });

export const addCartItem = async ({ productId, quantity }) =>
  apiFetch("/cart/add", {
    method: "POST",
    body: JSON.stringify({ productId, quantity })
  });

export const updateCartItem = async ({ productId, quantity }) =>
  apiFetch("/cart/update", {
    method: "PUT",
    body: JSON.stringify({ productId, quantity })
  });

export const removeCartItem = async (productId) =>
  apiFetch(`/cart/remove/${productId}`, {
    method: "DELETE"
  });

export const clearCart = async () =>
  apiFetch("/cart/clear", {
    method: "DELETE"
  });

export const clearSession = () => {
  clearStoredSession();
};
