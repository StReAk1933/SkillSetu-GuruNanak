export const learningPaths = [
  {
    id: 'path-cybersecurity',
    title: 'Public Sector Cybersecurity & Compliance',
    skillId: 'cyberSecurity',
    skillName: 'Cybersecurity',
    category: 'Security & Infrastructure',
    duration: '4 weeks · 8 modules',
    priority: 'Critical Project Gap',
    targetLevel: 4,
    reason: 'Critical requirement for the Integrated Grievance Platform. Completing and verifying this skill significantly increases candidate match score.',
    learningObjectives: [
      'Identify common threat vectors in public-sector infrastructure.',
      'Apply zero-trust and citizen-authentication controls.',
      'Recognize OWASP Top 10 API vulnerabilities and appropriate mitigations.',
      'Describe incident response, CERT-In reporting, and audit logging practices.',
    ],
    modules: [
      { id: 'cs-m1', title: 'Threat Vectors & GovTech Infrastructure Hardening', duration: '45 mins', completed: false },
      { id: 'cs-m2', title: 'Zero-Trust Architecture & Citizen Auth Controls', duration: '60 mins', completed: false },
      { id: 'cs-m3', title: 'OWASP Top 10 & API Vulnerability Scanning', duration: '50 mins', completed: false },
      { id: 'cs-m4', title: 'CERT-In Compliance, Incident Response & Audit Logs', duration: '40 mins', completed: false },
    ],
    assessment: {
      topic: 'Cybersecurity & Public Infrastructure Security',
      skill: 'Cybersecurity',
      difficulty: 'Intermediate',
      passPercentage: 70,
    },
  },
  {
    id: 'path-apidesign',
    title: 'Enterprise API Design & Secure Gateway Architecture',
    skillId: 'apiDesign',
    skillName: 'API Design',
    category: 'Architecture & Design',
    duration: '3 weeks · 6 modules',
    priority: 'Recommended for Staffing',
    targetLevel: 4,
    reason: 'Strengthen OpenAPI 3.1 specification, rate limiting, and contract validation required by public platform APIs.',
    learningObjectives: [
      'Design contract-first REST APIs with clear schemas.',
      'Apply gateway routing, rate limiting, and throttling.',
      'Select appropriate transport and token security controls.',
    ],
    modules: [
      { id: 'api-m1', title: 'Contract-First RESTful Architecture & Schema Design', duration: '40 mins', completed: true },
      { id: 'api-m2', title: 'API Gateway Routing, Rate Limiting & Throttling', duration: '50 mins', completed: false },
      { id: 'api-m3', title: 'Mutual TLS (mTLS), Token Revocation & Headers', duration: '45 mins', completed: false },
    ],
    assessment: {
      topic: 'Enterprise API Architecture & Standards',
      skill: 'API Design',
      difficulty: 'Intermediate',
      passPercentage: 70,
    },
  },
  {
    id: 'path-accessibility',
    title: 'Digital Accessibility & WCAG 2.2 AA Compliance',
    skillId: 'accessibility',
    skillName: 'Accessibility',
    category: 'Frontend & Citizen Experience',
    duration: '2 weeks · 4 modules',
    priority: 'Role Requirement',
    targetLevel: 4,
    reason: 'Ensures public digital services meet mandatory accessibility standards across screen readers and keyboard navigation.',
    learningObjectives: [
      'Apply WCAG principles to make interfaces perceivable and operable.',
      'Evaluate interfaces with screen readers and keyboard navigation.',
      'Use automated accessibility audits in a delivery pipeline.',
    ],
    modules: [
      { id: 'a11y-m1', title: 'WCAG 2.2 Principles: Perceivable & Operable', duration: '35 mins', completed: true },
      { id: 'a11y-m2', title: 'Screen Reader Testing (NVDA / TalkBack)', duration: '45 mins', completed: true },
      { id: 'a11y-m3', title: 'Automated Axe-Core Audits in CI/CD Pipelines', duration: '40 mins', completed: false },
    ],
    assessment: {
      topic: 'Web Accessibility & Inclusive Public Form Design',
      skill: 'Accessibility',
      difficulty: 'Intermediate',
      passPercentage: 70,
    },
  },
  {
    id: 'path-dataviz',
    title: 'Advanced Geospatial & Real-Time Data Visualization',
    skillId: 'dataVisualization',
    skillName: 'Data Visualization',
    category: 'Analytics & BI',
    duration: '4 weeks · 8 modules',
    priority: 'Analytics Expansion',
    targetLevel: 5,
    reason: 'Build interactive command dashboards for district-level and national telemetry visualization.',
    learningObjectives: [
      'Build geospatial visualizations using MapLibre and GeoJSON.',
      'Choose rendering approaches for high-volume time-series data.',
      'Design state-level KPI aggregations for operational dashboards.',
    ],
    modules: [
      { id: 'viz-m1', title: 'Geospatial Mapping with MapLibre & GeoJSON', duration: '50 mins', completed: true },
      { id: 'viz-m2', title: 'High-Throughput Time-Series Rendering in Recharts/D3', duration: '60 mins', completed: false },
      { id: 'viz-m3', title: 'State-Level Citizen KPI Aggregations', duration: '45 mins', completed: false },
    ],
    assessment: {
      topic: 'Data Visualization & High-Frequency Telemetry',
      skill: 'Data Visualization',
      difficulty: 'Advanced',
      passPercentage: 75,
    },
  },
]

export function recommendLearningPaths(employee, paths = learningPaths) {
  if (!employee) return []

  return paths
    .map((path, index) => {
      const competency = employee.competencies?.find((item) => item.skillId === path.skillId)
      const level = competency?.level ?? 0
      const verified = competency?.status === 'verified' || (competency?.status == null && competency?.verified)
      const levelGap = Math.max(path.targetLevel - level, 0)
      const gapDescription = !competency
        ? `No ${path.skillName} level is recorded; this course targets level ${path.targetLevel}.`
        : levelGap > 0
          ? `Your ${path.skillName} level is ${level}/${path.targetLevel}; ${verified ? 'build toward the target level' : 'build the skill and submit evidence for reviewer verification'}.`
          : `Your ${path.skillName} level meets the target, but its evidence is ${competency.status || 'not verified'}; this course can support preparation for reviewer verification.`

      return {
        path,
        index,
        competency,
        level,
        levelGap,
        verified,
        gapDescription,
      }
    })
    .filter(({ levelGap, verified }) => levelGap > 0 || !verified)
    .sort((a, b) => b.levelGap - a.levelGap || Number(a.verified) - Number(b.verified) || a.index - b.index)
    .map(({ path, competency, level, levelGap, verified, gapDescription }) => ({
      ...path,
      reason: `${gapDescription} ${path.reason}`,
      currentLevel: level,
      verificationStatus: competency?.status || 'unverified',
      levelGap,
      isVerified: verified,
    }))
}
