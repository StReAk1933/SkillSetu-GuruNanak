import { BarChart3, BookOpen, BriefcaseBusiness, CheckCircle2, ChevronRight, GraduationCap, LayoutDashboard, Network, ShieldCheck } from 'lucide-react'
import Header from './Header'
import { useAppContext } from '../../context/useAppContext'

const adminNavigation = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Competency', icon: Network },
  { label: 'Learning', icon: BookOpen },
  { label: 'Verification', icon: ShieldCheck },
  { label: 'Projects', icon: BriefcaseBusiness },
  { label: 'Simulation', icon: GraduationCap },
  { label: 'Impact', icon: BarChart3 },
]

const employeeNavigation = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Competency', icon: Network },
  { label: 'Learning', icon: BookOpen },
  { label: 'Verification', icon: ShieldCheck },
  { label: 'Projects', icon: BriefcaseBusiness },
]

function AppShell({ children, activeTab = 'Verification', onTabChange, workspace = 'admin', onWorkspaceChange }) {
  const { pendingReviews } = useAppContext()
  const navigation = workspace === 'employee' ? employeeNavigation : adminNavigation

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
          <span className="grid size-9 place-items-center rounded-xl bg-emerald-500 text-lg font-black text-white">S</span>
          <div>
            <p className="text-lg font-extrabold tracking-tight text-slate-950">SkillSetu</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Skill intelligence</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-6">
          <div className="flex items-center justify-between px-3 pb-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              {workspace === 'employee' ? 'Employee Navigation' : 'Admin Navigation'}
            </p>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 uppercase">
              {workspace}
            </span>
          </div>
          {navigation.map(({ label, icon: Icon }) => {
            const isActive = activeTab === label
            const isVerificationTab = label === 'Verification'
            const pendingCount = workspace === 'admin' && isVerificationTab ? pendingReviews.length : 0

            return (
              <button
                key={label}
                onClick={() => onTabChange && onTabChange(label)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.4 : 2} />
                <span>{label}</span>
                {pendingCount > 0 && (
                  <span className="ml-auto rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-black text-white">
                    {pendingCount}
                  </span>
                )}
                {isActive && pendingCount === 0 && <ChevronRight size={15} className="ml-auto" />}
              </button>
            )
          })}
        </nav>

        <div className="m-4 rounded-2xl bg-slate-900 p-4 text-white">
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-lg bg-emerald-400/15 p-2 text-emerald-300"><CheckCircle2 size={17} /></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">SIH 2026</span>
          </div>
          <p className="text-sm font-semibold">Workforce readiness</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">Use verified capability data to staff the work that matters.</p>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="relative z-40">
          <Header workspace={workspace} onWorkspaceChange={onWorkspaceChange} />
        </div>
        <nav
          className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 lg:hidden"
          aria-label="Primary navigation"
        >
          {navigation.map(({ label, icon: Icon }) => {
            const isActive = activeTab === label
            const pendingCount = workspace === 'admin' && label === 'Verification' ? pendingReviews.length : 0

            return (
              <button
                key={label}
                type="button"
                onClick={() => onTabChange?.(label)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon size={15} />
                <span>{label}</span>
                {pendingCount > 0 && (
                  <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[9px] font-black text-white">
                    {pendingCount}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

export default AppShell
