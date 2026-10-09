import { useEffect, useRef, useState } from 'react'
import { Bell, BriefcaseBusiness, ChevronDown, LogOut, Search, Shield, UserRound } from 'lucide-react'

function Header({ workspace = 'admin', onWorkspaceChange, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false)
    }
    const handleEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const selectWorkspace = (nextWorkspace) => {
    onWorkspaceChange?.(nextWorkspace)
    setMenuOpen(false)
  }

  const isAdmin = user?.role === 'ADMIN' || (!user && workspace === 'admin')
  const displayName = user?.name || (workspace === 'employee' ? 'Rahul Sharma' : 'Admin Reviewer')
  const userInitials = user?.avatar || (workspace === 'employee' ? 'RS' : 'AM')
  const roleLabel = user?.role === 'ADMIN' ? 'Admin / Reviewer' : 'Employee / Official'

  return (
    <header className="flex min-h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">Workforce intelligence</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900">{workspace === 'employee' ? 'Employee workspace' : 'Real-work matching'}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 md:flex">
          <Search size={16} />
          <span>Search workspace</span>
          <kbd className="ml-4 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">/</kbd>
        </div>
        <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-emerald-500" />
        </button>
        <div ref={menuRef} className="relative">
          <button type="button" onClick={() => setMenuOpen((isOpen) => !isOpen)} className="flex items-center gap-2 rounded-xl border border-slate-200 px-2.5 py-2 text-left transition hover:bg-slate-50" aria-haspopup="menu" aria-expanded={menuOpen}>
            <span className={`grid size-8 place-items-center rounded-lg text-xs font-bold text-white ${workspace === 'employee' ? 'bg-emerald-600' : 'bg-slate-900'}`}>{userInitials}</span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-semibold text-slate-700">{displayName}</span>
              <span className={`block text-[10px] font-bold uppercase tracking-wider ${workspace === 'employee' ? 'text-emerald-600' : 'text-indigo-600'}`}>{roleLabel}</span>
            </span>
            <ChevronDown size={15} className="text-slate-400" />
          </button>
          <div className={`${menuOpen ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-1 opacity-0'} absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl transition`} role="menu">
            <div className="border-b border-slate-100 px-3 py-2">
              <p className="text-xs font-semibold text-slate-800">{displayName}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email || 'Logged in user'}</p>
              <span className="mt-1 inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                <Shield size={10} /> {user?.role || (workspace === 'employee' ? 'EMPLOYEE' : 'ADMIN')}
              </span>
            </div>
            {isAdmin && (
              <div className="py-1">
                <button type="button" onClick={() => selectWorkspace('admin')} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold ${workspace === 'admin' ? 'bg-slate-50 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`} role="menuitem"><BriefcaseBusiness size={16} />Admin workspace</button>
                <button type="button" onClick={() => selectWorkspace('employee')} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold ${workspace === 'employee' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`} role="menuitem"><UserRound size={16} />Employee view</button>
              </div>
            )}
            <div className="border-t border-slate-100 pt-1 mt-1">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  onLogout?.()
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
                role="menuitem"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
