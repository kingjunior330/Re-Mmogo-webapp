import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

const API_BASE = "http://localhost:5000";

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [loans, setLoans] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [members, setMembers] = useState([]);
  const [activity, setActivity] = useState([]);

  /* ---------------------------------- */
  /* AUTH */
  /* ---------------------------------- */

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  function saveAuth(token, userData) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setLoans([]);
    setContributions([]);
    setMembers([]);
    setActivity([]);
  }

  /* ---------------------------------- */
  /* API HELPER */
  /* ---------------------------------- */

  async function apiFetch(path, options = {}) {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}${path}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers || {}),
        },
        ...options,
      });

      const data = await res.json();

      return {
        ok: res.ok,
        status: res.status,
        data,
      };
    } catch (error) {
      console.error(error);

      return {
        ok: false,
        data: {
          message: "Network error. Please try again.",
        },
      };
    }
  }

  /* ---------------------------------- */
  /* LOGIN */
  /* ---------------------------------- */

  async function login(email, password) {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (res.ok) {
      saveAuth(res.data.token, res.data.user);
    }

    return res;
  }

  /* ---------------------------------- */
  /* REGISTER */
  /* ---------------------------------- */

  async function register(fullName, email, phone, password) {
    return await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        fullName,
        email,
        phone,
        password,
      }),
    });
  }

  /* ---------------------------------- */
  /* GROUPS */
  /* ---------------------------------- */

  async function createGroup(name, description) {
    const res = await apiFetch("/groups", {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
      }),
    });

    if (res.ok && res.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
    }

    return res;
  }

  async function joinGroup(code) {
    const res = await apiFetch("/groups/join", {
      method: "POST",
      body: JSON.stringify({
        code,
      }),
    });

    if (res.ok && res.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
    }

    return res;
  }

  /* ---------------------------------- */
  /* MEMBERS */
  /* ---------------------------------- */

  async function fetchMembers() {
    const res = await apiFetch("/members");

    if (res.ok) {
      setMembers(res.data.members || []);
    }
  }

  /* ---------------------------------- */
  /* CONTRIBUTIONS */
  /* ---------------------------------- */

  async function fetchContributions() {
    const res = await apiFetch("/contributions");

    if (res.ok) {
      const items = res.data.contributions || [];

      setContributions(items);

      setActivity((prev) => [
        ...items.slice(0, 5).map((item) => ({
          id: `c-${item.id}`,
          type: "contribution",
          text: `${
            item.memberName || "Member"
          } contributed P${Number(item.amount || 0).toLocaleString()}`,
          time: "recently",
        })),
        ...prev,
      ]);
    }
  }

  /* ---------------------------------- */
  /* LOANS */
  /* ---------------------------------- */

  async function fetchLoans(includeHistory = false) {
    const res = await apiFetch(
      includeHistory ? "/loans?all=true" : "/loans"
    );

    if (res.ok) {
      const items = res.data.loans || [];

      setLoans(items);

      setActivity((prev) => [
        ...items.slice(0, 5).map((item) => ({
          id: `l-${item.id}`,
          type: "loan",
          text: `${
            item.memberName || "Member"
          } applied for P${Number(
            item.amount || item.principalAmount || 0
          ).toLocaleString()} loan`,
          time: "recently",
        })),
        ...prev,
      ]);
    }
  }

  /* ---------------------------------- */
  /* CONTEXT VALUE */
  /* ---------------------------------- */

  const value = {
    API_BASE,

    user,
    setUser,

    loading,

    loans,
    setLoans,

    contributions,
    setContributions,

    members,
    setMembers,

    activity,
    setActivity,

    login,
    register,
    logout,

    createGroup,
    joinGroup,

    fetchLoans,
    fetchContributions,
    fetchMembers,

    apiFetch,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}