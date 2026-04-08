"use client";

import { useState } from "react";

import { login as loginApi } from "../lib/api";

export default function Login({ setUser, setPage, showToast, active }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      const result = await loginApi({ email, password: pass });
      setUser(result.user ?? null);
      showToast("OK", "Logged in as " + email);
      setPage("home");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <section className={"page " + (active ? "active" : "")} id="page-login">
      <div style={{ maxWidth: 480, margin: "40px auto", padding: 24, borderRadius: 12, background: "var(--bg)", boxShadow: "var(--shadow-out)" }}>
        <h2 style={{ marginBottom: 12 }}>Sign In</h2>
        <form onSubmit={submit}>
          <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "var(--text-muted)" }}>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: 10, borderRadius: 8, marginBottom: 12 }} />
          <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "var(--text-muted)" }}>Password</label>
          <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" required style={{ width: "100%", padding: 10, borderRadius: 8, marginBottom: 16 }} />
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button className="btn btn-primary" type="submit">Sign In</button>
            <button type="button" className="btn btn-ghost" onClick={() => setPage("home")}>Cancel</button>
          </div>
          {error ? <div style={{ color: "#dc3545", fontSize: 13, marginTop: 4 }}>{error}</div> : null}
        </form>
      </div>
    </section>
  );
}
