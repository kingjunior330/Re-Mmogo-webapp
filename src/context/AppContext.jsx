import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'

const AppContext = createContext()

const API = import.meta.env.VITE_API_URL || '/api'

// wrapper so we dont repeat the auth header every time
async function callApi(path, opts = {}) {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', ...opts.headers }
  if (token) headers['Authorization'] = 'Bearer ' + token

  try {
    const res = await fetch(API + path, { ...opts, headers })
    const raw = await res.text()
    let data

    try {
      data = raw ? JSON.parse(raw) : {}
    } catch {
      data = { message: raw || 'Unexpected server response' }
    }

    return { ok: res.ok, status: res.status, data }
  } catch {
    return {
      ok: false,
      status: 0,
      data: { message: 'Could not reach the server. Please make sure the backend is running.' }
    }
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')))

  const [loans, setLoans] = useState([])
  const [contributions, setContributions] = useState([])
  const [members, setMembers] = useState([])
  const [activity, setActivity] = useState([])
  const [memberRequests, setMemberRequests] = useState([])

  // restore session on load
  useEffect(() => {
    if (!token) {
      setUser(null)
      return
    }

    let cancelled = false

    async function restoreSession() {
      try {
        const res = await callApi('/auth/me')
        if (cancelled) return

        if (res.ok) {
          setUser(res.data.user)
        } else {
          localStorage.removeItem('token')
          setToken(null)
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem('token')
          setToken(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    setLoading(true)
    restoreSession()

    return () => {
      cancelled = true
    }
  }, [token])

  function addActivity(type, text) {
    const item = { id: Date.now(), type, text, time: 'just now' }
    setActivity(prev => [item, ...prev])
  }

  const login = useCallback(async (email, password) => {
    const res = await callApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    if (res.ok) {
      localStorage.setItem('token', res.data.token)
      setToken(res.data.token)
      setUser(res.data.user)
    }
    return res
  }, [])

  const register = useCallback(async (fullName, email, phone, password) => {
    return callApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, phone, password })
    })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setLoans([])
    setContributions([])
    setMembers([])
    setActivity([])
  }, [])

  const createGroup = useCallback(async (groupName, description) => {
    const res = await callApi('/groups', {
      method: 'POST',
      body: JSON.stringify({ groupName, description })
    })
    if (res.ok) {
      const g = res.data.group
      setUser(prev => ({ ...prev, groupId: g.id, groupName: g.groupName, groupCode: g.groupCode, role: 'admin' }))
    }
    return res
  }, [])

  const joinGroup = useCallback(async (groupCode) => {
    const res = await callApi('/groups/join', {
      method: 'POST',
      body: JSON.stringify({ groupCode })
    })
    if (res.ok) {
      const g = res.data.group
      setUser(prev => ({ ...prev, groupId: g.id, groupName: g.groupName, groupCode: g.groupCode, role: 'member' }))
    }
    return res
  }, [])

  const fetchLoans = useCallback(async (mine = false) => {
    const res = await callApi('/loans' + (mine ? '?mine=true' : ''))
    if (res.ok) setLoans(res.data.loans)
    return res.data
  }, [])

  const fetchContributions = useCallback(async (mine = false) => {
    const res = await callApi('/contributions' + (mine ? '?mine=true' : ''))
    if (res.ok) setContributions(res.data.contributions)
    return res.data
  }, [])

  const fetchMembers = useCallback(async () => {
    const res = await callApi('/members')
    if (res.ok) setMembers(res.data.members)
    return res.data
  }, [])

  // local state helpers (not persisted)
  function addLoan(loan) {
    const tmp = {
      id: Date.now(),
      principalAmount: loan.amount,
      outstandingBalance: loan.amount,
      interestAccrued: 0,
      status: 'pending',
      purpose: loan.reason,
      memberName: user ? user.fullName : 'Me',
      dueDate: loan.dueDate
    }
    setLoans(prev => [...prev, tmp])
    addActivity('loan', 'Loan of P' + loan.amount + ' submitted for approval')
  }

  function addMemberRequest(m) {
    const tmp = { id: Date.now(), name: m.name, email: m.email, role: m.role, status: 'Pending' }
    setMemberRequests(prev => [...prev, tmp])
    addActivity('member', m.name + ' requested to join the group')
  }

  function addContribution(c) {
    const tmp = {
      id: Date.now(),
      amount: c.amount,
      memberName: user ? user.fullName : 'Me',
      monthYear: c.month,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    setContributions(prev => [...prev, tmp])
    addActivity('contribution', 'Contribution of P' + c.amount + ' submitted')
  }

  function updateLoan(updated) {
    setLoans(prev => prev.map(l => l.id === updated.id ? { ...l, ...updated } : l))
  }

  return (
    <AppContext.Provider value={{
      user, token, loading,
      loans, contributions, members, activity, memberRequests,
      login, logout, register,
      createGroup, joinGroup,
      fetchLoans, fetchContributions, fetchMembers,
      addLoan, addContribution, addMemberRequest, updateLoan,
      addActivity,
      apiFetch: callApi
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
