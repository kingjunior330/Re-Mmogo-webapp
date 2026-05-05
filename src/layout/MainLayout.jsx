import { useState, useEffect, useRef } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import '../styles/design.css'

const NAV = [
  { path: '/dashboard',     icon: '📊', label: 'Dashboard'     },
  { path: '/groups',        icon: '👥', label: 'Groups'         },
  { path: '/contributions', icon: '💵', label: 'Contributions'  },
  { path: '/loans',         icon: '💰', label: 'Loans'          },
  { path: '/approvals',     icon: '✅', label: 'Approvals'      },
  { path: '/reports',       icon: '📈', label: 'Reports'        },
  { path: '/members',       icon: '👤', label: 'Members'        },
  { path: '/settings',      icon: '⚙️',  label: 'Settings'      },
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

  useEffect(() => {
    if (user) loadNotifs()
  }, [user])

  // close when clicking outside the dropdown
  useEffect(() => {
    function onClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  async function loadNotifs() {
    const items = []
    try {
      const cr = await apiFetch('/contributions')
      if (cr.ok) {
        cr.data.contributions.filter(c => c.status === 'pending').forEach(c => {
          items.push({ id: 'c' + c.id, icon: '💵', text: 'Contribution of P' + Number(c.amount).toLocaleString() + ' pending approval', path: '/approvals' })
        })
      }
      const lr = await apiFetch('/loans')
      if (lr.ok) {
        lr.data.loans.filter(l => l.status === 'pending').forEach(l => {
          items.push({ id: 'l' + l.id, icon: '💰', text: 'Loan of P' + Number(l.principalAmount).toLocaleString() + ' pending approval', path: '/approvals' })
        })
      }
    } catch(e) {
      console.log('notifs load failed', e)
    }
    setNotifs(items)
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
    ? user.fullName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <div className="app-layout">

      <div className={`sidebar-overlay ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />

      <aside className={`app-sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span className="logo-icon">👥</span>
          <span>Re-Mmogo</span>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(item => (
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
                {notifs.length === 0
                  ? <p className="notif-empty">No pending items 🎉</p>
                  : notifs.map(n => (
                    <div key={n.id} className="notif-item" onClick={() => goTo(n.path)}>
                      <span className="notif-ico">{n.icon}</span>
                      <span className="notif-txt">{n.text}</span>
                    </div>
                  ))
                }
                {notifs.length > 0 && (
                  <button className="notif-view-all" onClick={() => goTo('/approvals')}>
                    View All Approvals →
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
