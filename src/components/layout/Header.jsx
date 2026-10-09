import { useEffect, useRef, useState } from 'react'
import { Bell, BriefcaseBusiness, ChevronDown, RotateCcw, Search, UserRound } from 'lucide-react'
import { useAppContext } from '../../context/useAppContext'

function Header({ workspace = 'admin', onWorkspaceChange }) {
  const { currentEmployee, employees, setCurrentEmployeeId, pendingReviews, resetDemoData } = useAppContext()
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

  const handleReset = () => {
    if (window.confirm('Reset prototype to default demo data? All local changes will be cleared.')) {
      resetDemoData()
      setMenuOpen(false)
    }
  }

  const employeeAvatar = currentEmployee?.avatar || currentEmployee?.name?.substring(0, 2).toUpperCase() || 'AS'

  return (
    <header className="flex min-h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">Workforce intelligence</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
          {workspace === 'employee' ? `${currentEmployee?.name}'s Workspace` : 'Real-work matching'}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {workspace === 'admin' && pendingReviews.length > 0 && (
          <div className="hidden items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 sm:flex">
            <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{pendingReviews.length} pending review{pendingReviews.length > 1 ? 's' : ''}</span>
          </div>
        )}
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 md:flex">
          <Search size={16} />
          <span>Search workspace</span>
          <kbd className="ml-4 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">/</kbd>
        </div>
        <button
          className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50"
          aria-label="Notifications"
          title={pendingReviews.length > 0 ? `${pendingReviews.length} pending reviews in queue` : 'No new notifications'}
        >
          <Bell size={18} />
          {pendingReviews.length > 0 && (
            <span className="absolute right-2 top-2 size-2 rounded-full bg-amber-500 ring-2 ring-white" />
          )}
        </button>
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-2.5 py-2 text-left transition hover:bg-slate-50"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <span
              className={`grid size-8 place-items-center rounded-lg text-xs font-bold text-white ${
                workspace === 'employee' ? 'bg-emerald-600' : 'bg-slate-900'
              }`}
            >
              {workspace === 'employee' ? employeeAvatar : 'AM'}
            </span>
            <span className="hidden text-left sm:block">
              {workspace === 'employee' ? (
                <>
                  <span className="block text-sm font-semibold text-slate-700">{currentEmployee?.name}</span>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    Employee workspace
                  </span>
                </>
              ) : (
                <>
                  <span className="block text-sm font-semibold text-slate-700">Admin workspace</span>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Reviewer role</span>
                </>
              )}
            </span>
            <ChevronDown size={15} className="text-slate-400" />
          </button>
          <div
            className={`${
              menuOpen ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-1 opacity-0'
            } absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl transition`}
            role="menu"
          >
            <div className="px-3 py-2 border-b border-slate-100 mb-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Switch workspace role</p>
            </div>
            <button
              type="button"
              onClick={() => selectWorkspace('admin')}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                workspace === 'admin' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
              }`}
              role="menuitem"
            >
              <span className="flex items-center gap-2.5">
                <BriefcaseBusiness size={16} /> Admin / Reviewer
              </span>
              {workspace === 'admin' && <span className="size-1.5 rounded-full bg-slate-900" />}
            </button>
            <button
              type="button"
              onClick={() => selectWorkspace('employee')}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                workspace === 'employee' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
              role="menuitem"
            >
              <span className="flex items-center gap-2.5">
                <UserRound size={16} /> Employee Workspace
              </span>
              {workspace === 'employee' && <span className="size-1.5 rounded-full bg-emerald-600" />}
            </button>

            {workspace === 'employee' && (
              <div className="mt-2 pt-2 border-t border-slate-100">
                <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Demo Employee
                </p>
                <div className="max-h-36 overflow-y-auto space-y-0.5">
                  {employees.map((emp) => (
                    <button
                      key={emp.id}
                      type="button"
                      onClick={() => {
                        setCurrentEmployeeId(emp.id)
                        setMenuOpen(false)
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs ${
                        emp.id === currentEmployee?.id
                          ? 'bg-emerald-50 font-bold text-emerald-800'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{emp.name}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{emp.avatar}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleReset}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50"
              >
                <RotateCcw size={14} /> Reset Prototype Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}


export default Header
