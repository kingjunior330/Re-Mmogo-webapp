import { useState, useEffect, useRef, useCallback } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import '../styles/design.css'

const NAV = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/groups', icon: '👥', label: 'Groups' },
  { path: '/contributions', icon: '💵', label: 'Contributions' },
  { path: '/loans', icon: '💰', label: 'Loans' },
  { path: '/approvals', icon: '✅', label: 'Approvals' },
  { path: '/reports', icon: '📈', label: 'Reports' },
  { path: '/members', icon: '👤', label: 'Members' },
  { path: '/settings', icon: '⚙️', label: 'Settings' },
]

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/groups': 'My Group',
  '/contributions': 'Contributions',
  '/loans': 'Loans',
  '/approvals': 'Approvals',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/members': 'Members',
}

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, apiFetch, myGroups, fetchMyGroups, switchGroup } = useApp()
  const [open, setOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifs, setNotifs] = useState([])
  const [groupPickerOpen, setGroupPickerOpen] = useState(false)
  const notifRef = useRef(null)
  const groupPickerRef = useRef(null)

  const loadNotifs = useCallback(async () => {
    const items = []

    try {
      const contributionRes = await apiFetch('/contributions')
      if (contributionRes.ok) {
        contributionRes.data.contributions
          .filter((contribution) => contribution.status === 'pending')
          .forEach((contribution) => {
            items.push({
              id: `c${contribution.id}`,
              icon: '💵',
              text: `Contribution of P${Number(contribution.amount).toLocaleString()} pending approval`,
              path: '/approvals',
            })
          })
      }

      const loanRes = await apiFetch('/loans')
      if (loanRes.ok) {
        loanRes.data.loans
          .filter((loan) => loan.status === 'pending')
          .forEach((loan) => {
            items.push({
              id: `l${loan.id}`,
              icon: '💰',
              text: `Loan of P${Number(loan.principalAmount).toLocaleString()} pending approval`,
              path: '/approvals',
            })
          })
      }
    } catch (error) {
      console.log('notifs load failed', error)
    }

    setNotifs(items)
  }, [apiFetch])

  useEffect(() => {
    if (!user) return undefined

    const timer = setTimeout(() => {
      loadNotifs()
      fetchMyGroups()
    }, 0)

    return () => clearTimeout(timer)
  }, [loadNotifs, user, fetchMyGroups])

  useEffect(() => {
    function onClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false)
      }
      if (groupPickerRef.current && !groupPickerRef.current.contains(event.target)) {
        setGroupPickerOpen(false)
      }
    }

    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  async function pickGroup(gId) {
    if (gId === user?.groupId) { setGroupPickerOpen(false); return }
    await switchGroup(gId)
    setGroupPickerOpen(false)
    // back to dashboard so the new group's data shows
    navigate('/dashboard')
  }

  function goTo(path) {
    navigate(path)
    setOpen(false)
    setNotifOpen(false)
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function toggleNotif() {
    if (!notifOpen) loadNotifs()
    setNotifOpen(!notifOpen)
  }

  const title = PAGE_TITLES[location.pathname] || 'Re-Mmogo'
  const initials = user?.fullName
    ? user.fullName.split(' ').map((word) => word[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <div className="app-layout">
      <div className={`sidebar-overlay ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />

      <aside className={`app-sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span className="logo-icon">👥</span>
          <span>Re-Mmogo</span>
        </div>

        {/* group switcher - only shows when user is in 1+ groups */}
        {user?.groupId && (
          <div className="group-switcher" ref={groupPickerRef} style={{ position: 'relative', padding: '0 16px 12px' }}>
            <button
              onClick={() => setGroupPickerOpen(!groupPickerOpen)}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 8,
                background: 'rgba(255,255,255,0.08)', color: 'white',
                border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontSize: 13, textAlign: 'left'
              }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.groupName || 'My Group'}
              </span>
              <span style={{ marginLeft: 6, opacity: 0.7 }}>▾</span>
            </button>

            {groupPickerOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 16, right: 16, marginTop: 4,
                background: 'white', color: '#1f2937', borderRadius: 8,
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)', zIndex: 50,
                maxHeight: 240, overflowY: 'auto'
              }}>
                {myGroups.length === 0 && (
                  <p style={{ padding: 12, fontSize: 13, color: '#6b7280', margin: 0 }}>Loading groups…</p>
                )}
                {myGroups.map(g => (
                  <button
                    key={g.id}
                    onClick={() => pickGroup(g.id)}
                    style={{
                      width: '100%', padding: '10px 12px', textAlign: 'left',
                      border: 'none', background: g.id === user.groupId ? '#eef2ff' : 'white',
                      cursor: 'pointer', fontSize: 13,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                    <span>
                      <strong style={{ display: 'block' }}>{g.groupName}</strong>
                      <span style={{ fontSize: 11, color: '#6b7280' }}>{g.role}</span>
                    </span>
                    {g.id === user.groupId && <span style={{ fontSize: 11, color: '#4f46e5' }}>✓</span>}
                  </button>
                ))}
                <div style={{ borderTop: '1px solid #e5e7eb' }}>
                  <button
                    onClick={() => { setGroupPickerOpen(false); navigate('/setup') }}
                    style={{
                      width: '100%', padding: '10px 12px', textAlign: 'left',
                      border: 'none', background: 'white', cursor: 'pointer',
                      fontSize: 13, color: '#4f46e5'
                    }}>
                    + Create or join another group
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => goTo(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.fullName || 'User'}</div>
              <div className="sidebar-user-role">{user?.role || 'member'}</div>
            </div>
            <button className="btn-logout" onClick={handleLogout} title="Log out">🚪</button>
          </div>
        </div>
      </aside>

      <header className="app-topbar">
        <button className="topbar-menu-btn" onClick={() => setOpen(!open)}>☰</button>
        <span className="topbar-title">{title}</span>
        <div className="topbar-actions">
          <div className="notif-wrap" ref={notifRef}>
            <button className="topbar-icon-btn notif-btn" onClick={toggleNotif}>
              🔔
              {notifs.length > 0 && <span className="notif-badge">{notifs.length}</span>}
            </button>

            {notifOpen && (
              <div className="notif-dropdown">
                <p className="notif-header">Notifications</p>
                {notifs.length === 0 ? (
                  <p className="notif-empty">No pending items.</p>
                ) : (
                  notifs.map((notif) => (
                    <div key={notif.id} className="notif-item" onClick={() => goTo(notif.path)}>
                      <span className="notif-ico">{notif.icon}</span>
                      <span className="notif-txt">{notif.text}</span>
                    </div>
                  ))
                )}
                {notifs.length > 0 && (
                  <button className="notif-view-all" onClick={() => goTo('/approvals')}>
                    View All Approvals
                  </button>
                )}
              </div>
            )}
          </div>

          <button className="topbar-icon-btn" onClick={() => goTo('/settings')}>👤</button>
        </div>
      </header>

      <main className="app-content">
        <div className="page-inner">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
