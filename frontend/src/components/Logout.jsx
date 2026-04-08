"use client";

import { useEffect, useRef } from "react";

import { logout as logoutApi } from "../lib/api";
import { clearStoredSession } from "../lib/session";

export default function Logout({ setUser, setPage, showToast, active }) {
  const hasLoggedOutRef = useRef(false);
  const showToastRef = useRef(showToast);

  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  useEffect(() => {
    if (!active) {
      hasLoggedOutRef.current = false;
      return;
    }

    if (hasLoggedOutRef.current) {
      return;
    }

    hasLoggedOutRef.current = true;
    let cancelled = false;
    let timerId;

    const runLogout = async () => {
      const refreshToken = localStorage.getItem("refreshToken");

      try {
        if (refreshToken) {
          await logoutApi({ refreshToken });
        }
      } catch (error) {
        console.error("Logout request failed", error);
      }

      if (cancelled) {
        return;
      }

      clearStoredSession();
      setUser(null);
      showToastRef.current("OK", "Logged out");
      timerId = setTimeout(() => setPage("home"), 800);
    };

    runLogout();

    return () => {
      cancelled = true;
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [active, setPage, setUser]);

  return (
    <section className={"page " + (active ? "active" : "")} id="page-logout">
      <div
        style={{
          maxWidth: 480,
          margin: "40px auto",
          padding: 24,
          borderRadius: 12,
          background: "var(--bg)",
          boxShadow: "var(--shadow-out)",
          textAlign: "center"
        }}
      >
        <h3>Signing out...</h3>
      </div>
    </section>
  );
}
