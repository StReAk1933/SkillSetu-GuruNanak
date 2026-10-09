import { useState } from 'react'
import { ArrowUpRight, BookOpen, BrainCircuit, CheckCircle2, ChevronRight, GraduationCap, Play, RotateCcw, Sparkles, Target, TrendingUp, Users, WalletCards } from 'lucide-react'
import { useAppContext } from '../context/useAppContext'

const meta = {
  Dashboard: ['WORKFORCE INTELLIGENCE', 'SkillSetu Dashboard', 'One view of competency, learning, verification, project matching and workforce impact.'],
  Learning: ['MODULE 2 • LEARNING INTELLIGENCE', 'AI Learning & Skill Gap', 'Turn verified competency gaps into targeted learning plans and measurable skill growth.'],
  Simulation: ['MODULE 5 • WORKFORCE PLANNING', 'Workforce What-If Simulator', 'Explore how upskilling and deployment scenarios change workforce readiness.'],
  Impact: ['MODULE 6 • TRAINING ANALYTICS', 'Training Impact & ROI', 'Track competency improvement, verification, training effectiveness and measurable return.'],
}

function Stat({ icon: Icon, label, value, note }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between"><span className="rounded-xl bg-slate-100 p-2.5 text-slate-700"><Icon size={19}/></span><TrendingUp size={17} className="text-emerald-500"/></div>
    <p className="mt-4 text-2xl font-extrabold text-slate-950">{value}</p>
    <p className="text-sm font-semibold text-slate-700">{label}</p>
    <p className="mt-1 text-xs text-slate-400">{note}</p>
  </div>
}

function Progress({ value }) {
  return <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{width: `${Math.min(100, value)}%`}}/></div>
}

function LearningModule({ employees, learningPaths, learningRecords, updateLearningProgress, currentEmployee }) {
  const [selectedPathId, setSelectedPathId] = useState(learningPaths[0]?.id)
  const [notice, setNotice] = useState('')
  const program = learningPaths.find((path) => path.id === selectedPathId) || learningPaths[0]
  const employeeId = currentEmployee?.id
  const progress = learningRecords[employeeId]?.[program?.id]
  const gaps = employees.reduce(
    (count, employee) => count + employee.competencies.filter((competency) => competency.status !== 'verified').length,
    0,
  )
  const completedPaths = Object.values(learningRecords).flatMap((records) =>
    Object.values(records).filter((record) => record.status === 'completed'),
  ).length
  const verifiedCount = employees.flatMap((employee) => employee.competencies)
    .filter((competency) => competency.status === 'verified' || competency.verified).length
  const totalCompetencies = employees.reduce((count, employee) => count + employee.competencies.length, 0)
  const verifiedRate = totalCompetencies ? Math.round((verifiedCount / totalCompetencies) * 100) : 0

  const advanceLearning = () => {
    if (!program || !employeeId || progress?.status === 'completed') return
    updateLearningProgress({
      employeeId,
      pathId: program.id,
      progressDelta: 15,
    })
    setNotice(`${program.title} progress saved for ${currentEmployee.name}. Learning does not automatically verify a skill.`)
  }

  return <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-3">
      <Stat icon={Target} label="Competency gaps" value={gaps} note="From shared employee profiles"/>
      <Stat icon={BookOpen} label="Completed learning paths" value={completedPaths} note="Persisted demo learning records"/>
      <Stat icon={CheckCircle2} label="Verified competencies" value={`${verifiedRate}%`} note="Reviewer-approved shared records"/>
    </div>
    <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-extrabold">Recommended learning paths</h2>
        <p className="text-sm text-slate-500">Choose a path for {currentEmployee?.name || 'the selected demo employee'}.</p>
        <div className="mt-5 space-y-3">
          {learningPaths.map((path) => {
            const pathProgress = learningRecords[employeeId]?.[path.id]
            return (
              <button key={path.id} onClick={() => setSelectedPathId(path.id)} className="flex w-full items-center gap-4 rounded-xl border border-slate-100 p-4 text-left hover:border-emerald-200 hover:bg-emerald-50/40">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-900 text-sm font-bold text-white">{path.skillName.slice(0, 2).toUpperCase()}</span>
                <span className="min-w-0 flex-1"><span className="block font-bold">{path.title}</span><span className="text-xs text-slate-500">Skill: <b>{path.skillName}</b> · {pathProgress?.progress || 0}% complete</span><Progress value={pathProgress?.progress || 0}/></span>
                <ChevronRight size={17} className="text-slate-400"/>
              </button>
            )
          })}
        </div>
      </section>
      <section className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
        <div className="flex items-center gap-2 text-emerald-300"><BrainCircuit size={20}/><span className="text-xs font-bold uppercase tracking-widest">Learning recommendation</span></div>
        <h2 className="mt-4 text-2xl font-extrabold">{program?.title || 'No learning paths available'}</h2>
        <p className="mt-2 text-sm text-slate-300">{program?.reason}</p>
        <p className="mt-4 text-xs text-slate-300">Selected employee: {currentEmployee?.name || 'None'} · Progress: {progress?.progress || 0}%</p>
        {notice && <p role="status" className="mt-3 text-xs text-emerald-200">{notice}</p>}
        <button type="button" disabled={!program || progress?.status === 'completed'} onClick={advanceLearning} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"><Play size={16}/>{progress?.status === 'completed' ? 'Path completed' : progress?.progress ? 'Advance demo learning' : 'Start learning path'}</button>
      </section>
    </div>
  </div>
}

function SimulationModule({ employees }) {
  const [training, setTraining] = useState(20)
  const [deployment, setDeployment] = useState(0)
  const competencies = employees.flatMap((employee) => employee.competencies)
  const verified = competencies.filter((competency) => competency.status === 'verified' || competency.verified).length
  const baseline = competencies.length ? Math.round((verified / competencies.length) * 100) : 0
  const projected = Math.min(100, Math.round(baseline + training * .25 + deployment * .1))
  const available = employees.filter((employee) => employee.availability === 'available').length
  const partiallyAvailable = employees.filter((employee) => employee.availability === 'partially available').length
  const capacity = Math.min(employees.length, available + Math.round(partiallyAvailable * deployment / 100))
  return <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-4">
      <Stat icon={Users} label="Employees evaluated" value={employees.length} note="Shared employee records"/>
      <Stat icon={Target} label="Baseline readiness" value={`${baseline}%`} note="Reviewer-approved competencies"/>
      <Stat icon={TrendingUp} label="Projected readiness" value={`${projected}%`} note="Scenario result"/>
      <Stat icon={CheckCircle2} label="Allocation capacity" value={capacity} note="Scenario-ready employees"/>
    </div>
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3"><GraduationCap className="text-emerald-600"/><div><h2 className="text-lg font-extrabold">Scenario controls</h2><p className="text-sm text-slate-500">Move the sliders and see readiness update instantly.</p></div></div>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <label><div className="flex justify-between text-sm font-bold"><span>Upskilling intensity</span><span>{training}%</span></div><input className="mt-4 w-full accent-emerald-500" type="range" min="0" max="60" value={training} onChange={e=>setTraining(+e.target.value)}/><p className="mt-2 text-xs text-slate-400">Targeted learning completion.</p></label>
        <label><div className="flex justify-between text-sm font-bold"><span>Deployment optimization</span><span>{deployment}%</span></div><input className="mt-4 w-full accent-emerald-500" type="range" min="0" max="80" value={deployment} onChange={e=>setDeployment(+e.target.value)}/><p className="mt-2 text-xs text-slate-400">Better project-to-person allocation.</p></label>
      </div>
      <div className="mt-8 rounded-2xl bg-slate-50 p-5"><div className="flex items-center justify-between"><span className="font-bold">Projected workforce readiness</span><span className="text-2xl font-extrabold text-emerald-600">{projected}%</span></div><Progress value={projected}/><div className="mt-4 flex justify-between text-xs text-slate-500"><span>Baseline {baseline}%</span><span>Scenario uplift +{projected-baseline} pts</span></div></div>
      <button onClick={()=>{setTraining(20);setDeployment(0)}} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-slate-600"><RotateCcw size={15}/> Reset scenario</button>
      <p className="mt-3 text-xs text-slate-400">Illustrative assumptions: training intensity adds up to 15 readiness points; deployment optimization adds up to 8 points and can reclaim partially available capacity.</p>
    </section>
  </div>
}

function ImpactModule({ employees, learningRecords, learningPaths }) {
  const learning = Object.values(learningRecords).flatMap((records) => Object.values(records))
  const completed = learning.filter((record) => record.status === 'completed')
  const assessmentScores = completed.map((record) => record.assessmentScore).filter(Number.isFinite)
  const averageScore = assessmentScores.length
    ? Math.round(assessmentScores.reduce((total, score) => total + score, 0) / assessmentScores.length)
    : null
  const competencies = employees.flatMap((employee) => employee.competencies)
  const verifiedCount = competencies.filter((competency) => competency.status === 'verified' || competency.verified).length
  const verifiedRate = competencies.length ? Math.round((verifiedCount / competencies.length) * 100) : 0
  const completionRate = learning.length ? Math.round((completed.length / learning.length) * 100) : 0
  const impactIndex = Math.round(verifiedRate * .6 + completionRate * .4)

  return <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-4">
      <Stat icon={TrendingUp} label="Avg. assessment score" value={averageScore === null ? 'N/A' : `${averageScore}%`} note="Completed learning records"/>
      <Stat icon={CheckCircle2} label="Verified competencies" value={`${verifiedRate}%`} note="Reviewer-approved shared records"/>
      <Stat icon={WalletCards} label="Estimated training cost" value={`₹${completed.length * 150}`} note="Illustrative ₹150 per completed path"/>
      <Stat icon={ArrowUpRight} label="Demo impact index" value={`${impactIndex} / 100`} note="60% verification + 40% completion"/>
    </div>
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-extrabold">Training effectiveness & impact</h2><p className="text-sm text-slate-500">Values are derived from local demo learning and competency records; cost and impact weights are illustrative, not measured ROI.</p>
      <div className="mt-5 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400"><th className="pb-3">Learning path</th><th className="pb-3">Enrollments</th><th className="pb-3">Completed</th><th className="pb-3">Avg. assessment</th></tr></thead><tbody>{learningPaths.map((path) => {
        const records = Object.values(learningRecords).map((employeeRecords) => employeeRecords[path.id]).filter(Boolean)
        const completedRecords = records.filter((record) => record.status === 'completed')
        const scores = completedRecords.map((record) => record.assessmentScore).filter(Number.isFinite)
        const average = scores.length ? `${Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)}%` : 'N/A'
        return <tr key={path.id} className="border-b border-slate-50"><td className="py-4 font-bold">{path.title}</td><td>{records.length}</td><td>{completedRecords.length}</td><td>{average}</td></tr>
      })}</tbody></table></div>
    </section>
  </div>
}

function DashboardModule({ employees, globalVerificationStats }) {
  const availableCount = employees.filter((employee) => employee.availability === 'available').length
  return <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-4">
      <Stat icon={Users} label="Workforce profiles" value={employees.length} note="Shared demo employee records"/>
      <Stat icon={CheckCircle2} label="Verified competencies" value={`${globalVerificationStats.verifiedPercentage}%`} note="Evidence-backed shared skills"/>
      <Stat icon={Target} label="Pending reviews" value={globalVerificationStats.pendingCount} note="Evidence awaiting reviewer action"/>
      <Stat icon={TrendingUp} label="Available employees" value={availableCount} note="Availability from shared employee records"/>
    </div>
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-extrabold">Integrated SkillSetu modules</h2><p className="mt-1 text-sm text-slate-500">Competency, learning, verification, projects, simulation and impact now sit in one workspace.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">{['Competency Digital Twin','AI Learning & Skill Gap','Competency Verification','Project Matching','Workforce What-If Simulator','Training Impact & ROI'].map(x=><div key={x} className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"><CheckCircle2 size={18} className="text-emerald-500"/><span className="font-bold">{x}</span></div>)}</div>
    </section>
  </div>
}

export default function WorkforceModulesPage({ type = 'Dashboard' }) {
  const {
    employees,
    learningPaths,
    learningRecords,
    updateLearningProgress,
    currentEmployee,
    globalVerificationStats,
  } = useAppContext()
  const [eyebrow, title, description] = meta[type] || meta.Dashboard
  let body = <DashboardModule employees={employees} globalVerificationStats={globalVerificationStats}/>
  if (type === 'Learning') body = <LearningModule employees={employees} learningPaths={learningPaths} learningRecords={learningRecords} updateLearningProgress={updateLearningProgress} currentEmployee={currentEmployee}/>
  if (type === 'Simulation') body = <SimulationModule employees={employees}/>
  if (type === 'Impact') body = <ImpactModule employees={employees} learningRecords={learningRecords} learningPaths={learningPaths}/>
  return <div className="space-y-7">
    <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700"><Sparkles size={13}/>{eyebrow}</span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
          <p className="mt-3 text-base leading-7 text-slate-500">{description}</p>
        </div>
        <div className="rounded-2xl bg-slate-900 px-5 py-4 text-white"><p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Data layer</p><p className="mt-1 font-bold">Demo / Mock • Live UI</p></div>
      </div>
    </section>
    {body}
  </div>
}
