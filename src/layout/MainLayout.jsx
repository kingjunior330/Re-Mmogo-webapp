import { useState, useEffect, useRef, useCallback } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import '../styles/design.css'

const NAV = [
  { path: '/dashboard', icon: 'Dashboard', label: 'Dashboard' },
  { path: '/groups', icon: 'Groups', label: 'Groups' },
  { path: '/contributions', icon: 'Contrib', label: 'Contributions' },
  { path: '/loans', icon: 'Loans', label: 'Loans' },
  { path: '/approvals', icon: 'Approve', label: 'Approvals' },
  { path: '/reports', icon: 'Reports', label: 'Reports' },
  { path: '/members', icon: 'Members', label: 'Members' },
  { path: '/settings', icon: 'Settings', label: 'Settings' },
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
  const { user, logout, apiFetch } = useApp()
  const [open, setOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifs, setNotifs] = useState([])
  const notifRef = useRef(null)

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
              icon: 'Contrib',
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
              icon: 'Loan',
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
    }, 0)

    return () => clearTimeout(timer)
  }, [loadNotifs, user])

  useEffect(() => {
    function onClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false)
      }
    }

    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

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
          <span className="logo-icon">RG</span>
          <span>Re-Mmogo</span>
        </div>

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
            <button className="btn-logout" onClick={handleLogout} title="Log out">Log out</button>
          </div>
        </div>
      </aside>

      <header className="app-topbar">
        <button className="topbar-menu-btn" onClick={() => setOpen(!open)}>Menu</button>
        <span className="topbar-title">{title}</span>
        <div className="topbar-actions">
          <div className="notif-wrap" ref={notifRef}>
            <button className="topbar-icon-btn notif-btn" onClick={toggleNotif}>
              Alerts
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

          <button className="topbar-icon-btn" onClick={() => goTo('/settings')}>Profile</button>
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
