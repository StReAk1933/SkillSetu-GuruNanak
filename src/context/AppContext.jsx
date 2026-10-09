import { useEffect, useMemo, useState } from 'react'
import { AppContext } from './contextDef'
import { projects as defaultProjects } from '../data/projects'
import { unifiedEmployees } from '../data/unifiedEmployees'
import { learningPaths as defaultLearningPaths } from '../data/learningPaths'

const STORAGE_KEYS = {
  EMPLOYEES: 'skillsetu_v1_employees',
  WORKSPACE: 'skillsetu_v1_workspace',
  EMPLOYEE_ID: 'skillsetu_v1_current_employee_id',
  LEARNING: 'skillsetu_v1_learning_records',
}

const defaultLearningRecords = {
  'emp-001': {
    'path-cybersecurity': {
      status: 'in_progress',
      progress: 35,
      assessmentScore: null,
      completedAt: null,
    },
    'path-apidesign': {
      status: 'completed',
      progress: 100,
      assessmentScore: 88,
      completedAt: '2026-04-16',
    },
    'path-accessibility': {
      status: 'completed',
      progress: 100,
      assessmentScore: 92,
      completedAt: '2026-05-21',
    },
  },
  'emp-009': {
    'path-cybersecurity': {
      status: 'in_progress',
      progress: 20,
      assessmentScore: null,
      completedAt: null,
    },
    'path-accessibility': {
      status: 'completed',
      progress: 100,
      assessmentScore: 86,
      completedAt: '2026-08-09',
    },
  },
}

const mergeSeedEmployees = (savedEmployees = []) => {
  const seedById = new Map(unifiedEmployees.map((emp) => [emp.id, emp]))
  const savedById = new Map()

  savedEmployees.forEach((emp) => {
    if (!emp) return
    const id = emp.id || emp.employeeId
    if (id) savedById.set(id, emp)
  })

  const merged = unifiedEmployees.map((seedEmployee) => {
    const savedEmployee = savedById.get(seedEmployee.id) || savedById.get(seedEmployee.employeeId)
    if (!savedEmployee) return seedEmployee

    const mergedCompetencies = (savedEmployee.competencies || []).length > 0
      ? savedEmployee.competencies.map((savedComp) => {
          const seedComp = (seedEmployee.competencies || []).find((item) => item.skillId === savedComp.skillId)
          return { ...(seedComp || {}), ...savedComp }
        })
      : seedEmployee.competencies || []

    return {
      ...seedEmployee,
      ...savedEmployee,
      competencies: mergedCompetencies,
    }
  })

  savedEmployees.forEach((savedEmployee) => {
    const id = savedEmployee?.id || savedEmployee?.employeeId
    if (!id) return
    if (!merged.some((existing) => existing.id === id || existing.employeeId === id)) {
      merged.push(savedEmployee)
    }
  })

  return merged
}

export function AppProvider({ children }) {
  // 1. Employees state with localStorage hydration
  const [employees, setEmployees] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEES)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return mergeSeedEmployees(parsed)
      }
    } catch (e) {
      console.warn('Failed to parse saved employees, using initial seed data.', e)
    }
    return unifiedEmployees
  })

  // 2. Workspace role state
  const [workspace, setWorkspaceState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.WORKSPACE) || 'admin'
    } catch {
      return 'admin'
    }
  })

  // 3. Current active employee ID
  const [currentEmployeeId, setCurrentEmployeeIdState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEE_ID)
      const preferred = saved || 'emp-001'
      const fallback = unifiedEmployees.some((emp) => emp.id === preferred || emp.employeeId === preferred)
        ? preferred
        : unifiedEmployees[0]?.id || 'emp-001'
      return fallback
    } catch {
      return unifiedEmployees[0]?.id || 'emp-001'
    }
  })

  // 4. Learning records per employee
  const [learningRecords, setLearningRecords] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEARNING)
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    return defaultLearningRecords
  })

  // Persist employees when updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees))
    } catch (e) {
      console.warn('Error saving employees to localStorage:', e)
    }
  }, [employees])

  // Persist workspace
  const setWorkspace = (newWorkspace) => {
    setWorkspaceState(newWorkspace)
    try {
      localStorage.setItem(STORAGE_KEYS.WORKSPACE, newWorkspace)
    } catch {
      // ignore
    }
  }

  // Persist current employee
  const setCurrentEmployeeId = (newId) => {
    setCurrentEmployeeIdState(newId)
    try {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEE_ID, newId)
    } catch {
      // ignore
    }
  }

  // Persist learning records
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEARNING, JSON.stringify(learningRecords))
    } catch (e) {
      console.warn('Error saving learning records:', e)
    }
  }, [learningRecords])

  // Current selected employee object
  const currentEmployee = useMemo(() => {
    return employees.find((e) => e.id === currentEmployeeId || e.employeeId === currentEmployeeId) || employees[0]
  }, [employees, currentEmployeeId])

  // Helper to get formatted timestamp
  const getFormattedNow = () => {
    const now = new Date()
    return `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  // Action: Submit evidence for verification (creates PENDING record, does NOT verify)
  const submitEvidence = ({ employeeId, skillId, evidenceData }) => {
    const today = new Date().toISOString().split('T')[0]
    const timestamp = getFormattedNow()

    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== employeeId && emp.employeeId !== employeeId) return emp

        const updatedComps = emp.competencies.map((comp) => {
          if (comp.skillId !== skillId) return comp

          const newEvidenceId = `ev-${skillId}-${emp.id}-${Date.now()}`
          const evidencePayload = {
            id: newEvidenceId,
            employeeId: emp.id,
            skillId,
            type: evidenceData.type || 'Project evidence',
            date: today,
            source: evidenceData.source || 'SkillSetu Learning & Assessment Record',
            issuer: evidenceData.issuer || 'SkillSetu Verified Submission',
            credentialId: evidenceData.credentialId || `SUB-${Math.floor(10000 + Math.random() * 90000)}`,
            validUntil: 'Permanent',
            verifiedBy: 'Pending Reviewer Signoff',
            verificationScore: evidenceData.verificationScore || 85,
            summary:
              evidenceData.summary ||
              `Employee submitted proof for ${comp.skill || skillId}. Awaiting review approval.`,
            artifacts: evidenceData.artifacts || [],
            status: 'pending',
            auditTrail: [
              ...(comp.evidence?.auditTrail || []),
              {
                date: timestamp,
                action: 'Evidence Submitted for Review',
                actor: emp.name || emp.employeeName || 'Employee',
                reason: evidenceData.note || 'Initial submission',
              },
            ],
          }

          return {
            ...comp,
            status: 'pending',
            verified: false, // Strictly false while pending
            evidence: evidencePayload,
          }
        })

        return { ...emp, competencies: updatedComps }
      }),
    )
  }

  // Action: Reviewer approves or rejects evidence
  const reviewEvidence = ({ employeeId, skillId, decision, reason = '', reviewerName = 'Verification Lead' }) => {
    const today = new Date().toISOString().split('T')[0]
    const timestamp = getFormattedNow()

    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== employeeId && emp.employeeId !== employeeId) return emp

        const updatedComps = emp.competencies.map((comp) => {
          if (comp.skillId !== skillId) return comp

          const isApproved = decision === 'approve'
          const existingEvidence = comp.evidence || {}

          const updatedAuditTrail = [
            ...(existingEvidence.auditTrail || []),
            {
              date: timestamp,
              action: isApproved
                ? 'Evidence Approved & Competency Verified'
                : `Evidence Rejected: ${reason || 'Insufficient verification evidence'}`,
              actor: reviewerName,
              reason: reason || (isApproved ? 'Approved by verification board' : 'Returned for revision'),
            },
          ]

          const updatedEvidence = {
            ...existingEvidence,
            status: isApproved ? 'approved' : 'rejected',
            reviewedBy: reviewerName,
            reviewedAt: today,
            reviewReason: !isApproved ? reason : undefined,
            verifiedBy: isApproved ? reviewerName : existingEvidence.verifiedBy,
            auditTrail: updatedAuditTrail,
          }

          return {
            ...comp,
            status: isApproved ? 'verified' : 'rejected',
            verified: isApproved, // only true on explicit reviewer approval!
            verificationType: isApproved ? (updatedEvidence.type || 'Manager validation') : comp.verificationType,
            lastVerified: isApproved ? today : comp.lastVerified,
            evidence: updatedEvidence,
          }
        })

        return { ...emp, competencies: updatedComps }
      }),
    )
  }

  // Action: Resubmit evidence after rejection
  const resubmitEvidence = ({ employeeId, skillId, updatedEvidenceData }) => {
    const today = new Date().toISOString().split('T')[0]
    const timestamp = getFormattedNow()

    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== employeeId && emp.employeeId !== employeeId) return emp

        const updatedComps = emp.competencies.map((comp) => {
          if (comp.skillId !== skillId) return comp

          const existingEvidence = comp.evidence || {}
          const auditTrail = [
            ...(existingEvidence.auditTrail || []),
            {
              date: timestamp,
              action: 'Evidence Resubmitted after Revision',
              actor: emp.name || emp.employeeName || 'Employee',
              reason: updatedEvidenceData?.summary || 'Additional documentation provided',
            },
          ]

          return {
            ...comp,
            status: 'pending',
            verified: false,
            evidence: {
              ...existingEvidence,
              ...updatedEvidenceData,
              status: 'pending',
              date: today,
              reviewReason: undefined,
              auditTrail,
            },
          }
        })

        return { ...emp, competencies: updatedComps }
      }),
    )
  }

  // Action: Quick verify (authorized reviewer action only)
  const quickVerify = ({ employeeId, skillId, reviewerName = 'Verification Lead' }) => {
    reviewEvidence({
      employeeId,
      skillId,
      decision: 'approve',
      reason: 'Direct attestation signed by authorized verification officer',
      reviewerName,
    })
  }

  // Action: Update learning progress
  const updateLearningProgress = ({ employeeId, pathId, progressDelta, setAbsoluteProgress, assessmentScore }) => {
    setLearningRecords((prev) => {
      const empRecords = prev[employeeId] || {}
      const current = empRecords[pathId] || { status: 'not_started', progress: 0, assessmentScore: null, completedAt: null }
      const newProgress = setAbsoluteProgress !== undefined
        ? Math.min(100, Math.max(0, setAbsoluteProgress))
        : Math.min(100, Math.max(0, current.progress + (progressDelta || 15)))

      const isComplete = newProgress >= 100
      const today = new Date().toISOString().split('T')[0]

      return {
        ...prev,
        [employeeId]: {
          ...empRecords,
          [pathId]: {
            ...current,
            progress: newProgress,
            status: isComplete ? 'completed' : newProgress > 0 ? 'in_progress' : 'not_started',
            assessmentScore: assessmentScore !== undefined ? assessmentScore : current.assessmentScore,
            completedAt: isComplete ? (current.completedAt || today) : current.completedAt,
          },
        },
      }
    })
  }

  // Helper: List all pending evidence submissions awaiting reviewer action
  const pendingReviews = useMemo(() => {
    const list = []
    employees.forEach((emp) => {
      emp.competencies.forEach((comp) => {
        if (comp.status === 'pending') {
          list.push({
            employeeId: emp.id,
            employeeName: emp.name,
            avatar: emp.avatar,
            role: emp.role,
            department: emp.department,
            competency: comp,
            evidence: comp.evidence,
          })
        }
      })
    })
    return list
  }, [employees])

  // Helper: Workforce verification statistics derived from shared records
  const globalVerificationStats = useMemo(() => {
    let totalCompetencies = 0
    let verifiedCount = 0
    let pendingCount = 0
    let rejectedCount = 0
    let unverifiedCount = 0

    employees.forEach((emp) => {
      emp.competencies.forEach((c) => {
        totalCompetencies++
        if (c.status === 'verified' || c.verified) verifiedCount++
        else if (c.status === 'pending') pendingCount++
        else if (c.status === 'rejected') rejectedCount++
        else unverifiedCount++
      })
    })

    const verifiedPercentage = totalCompetencies > 0 ? Math.round((verifiedCount / totalCompetencies) * 100) : 0
    return {
      totalEmployees: employees.length,
      totalCompetencies,
      verifiedCount,
      pendingCount,
      rejectedCount,
      unverifiedCount,
      verifiedPercentage,
    }
  }, [employees])

  // Action: Reset demo state to clean seeds
  const resetDemoData = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.EMPLOYEES)
      localStorage.removeItem(STORAGE_KEYS.WORKSPACE)
      localStorage.removeItem(STORAGE_KEYS.EMPLOYEE_ID)
      localStorage.removeItem(STORAGE_KEYS.LEARNING)
    } catch {
      // ignore
    }
    setEmployees(unifiedEmployees)
    setWorkspaceState('admin')
    setCurrentEmployeeIdState('emp-001')
    setLearningRecords(defaultLearningRecords)
  }

  const value = {
    employees,
    projects: defaultProjects,
    learningPaths: defaultLearningPaths,
    workspace,
    setWorkspace,
    currentEmployeeId,
    setCurrentEmployeeId,
    currentEmployee,
    learningRecords,
    submitEvidence,
    reviewEvidence,
    resubmitEvidence,
    quickVerify,
    updateLearningProgress,
    pendingReviews,
    globalVerificationStats,
    resetDemoData,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppProvider

