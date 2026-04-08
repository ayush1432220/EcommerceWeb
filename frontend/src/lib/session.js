"use client";

const USER_KEY = "user";
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const safeParse = (value) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const readStoredSession = () => {
  if (typeof window === "undefined") {
    return {
      user: null,
      accessToken: "",
      refreshToken: ""
    };
  }

  return {
    user: safeParse(localStorage.getItem(USER_KEY)),
    accessToken: localStorage.getItem(ACCESS_TOKEN_KEY) || "",
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) || ""
  };
};

export const storeSession = ({ user = null, accessToken = "", refreshToken = "" }) => {
  if (typeof window === "undefined") {
    return;
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }

  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const clearStoredSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const getStoredAccessToken = () => readStoredSession().accessToken;
export const getStoredRefreshToken = () => readStoredSession().refreshToken;
