import { useState } from 'react'
import AppShell from './components/layout/AppShell'
import Login from './pages/Login'
import { getCurrentUser, isAuthenticated, logout } from './auth/auth'
import ProjectMatchingPage from './pages/ProjectMatchingPage'
import VerificationPage from './pages/VerificationPage'
import CompetencyDigitalTwin from './pages/competency/CompetencyDigitalTwin'
import WorkforceModulesPage from './pages/WorkforceModulesPage'
import EmployeeWorkspacePage from './pages/EmployeeWorkspacePage'
import EmployeeLearningPage from './pages/EmployeeLearningPage'
import EmployeeProjectsPage from './pages/EmployeeProjectsPage'
import EmployeeCompetencyPage from './pages/EmployeeCompetencyPage'
import EmployeeVerificationPage from './pages/EmployeeVerificationPage'

function App() {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser())
  const [isAuth, setIsAuth] = useState(() => isAuthenticated())
  const [workspace, setWorkspace] = useState(() => {
    const user = getCurrentUser()
    return user?.role === 'ADMIN' ? 'admin' : 'employee'
  })
  const [activeTab, setActiveTab] = useState(() => {
    const user = getCurrentUser()
    return user?.role === 'ADMIN' ? 'Verification' : 'Dashboard'
  })

  const handleLoginSuccess = (user) => {
    setCurrentUser(user)
    setIsAuth(true)
    const initialWorkspace = user.role === 'ADMIN' ? 'admin' : 'employee'
    setWorkspace(initialWorkspace)
    setActiveTab(user.role === 'ADMIN' ? 'Verification' : 'Dashboard')
  }

  const handleLogout = () => {
    logout()
    setCurrentUser(null)
    setIsAuth(false)
  }

  const handleWorkspaceChange = (nextWorkspace) => {
    // Role-based access control: Employee cannot switch to Admin workspace
    if (currentUser?.role === 'EMPLOYEE' && nextWorkspace === 'admin') {
      return
    }
    setWorkspace(nextWorkspace)
    setActiveTab('Dashboard')
  }

  // Unauthenticated users see Login page
  if (!isAuth || !currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  const renderAdminPage = () => {
    switch (activeTab) {
      case 'Competency': return <CompetencyDigitalTwin />
      case 'Verification': return <VerificationPage />
      case 'Projects': return <ProjectMatchingPage />
      case 'Learning': return <WorkforceModulesPage type="Learning" />
      case 'Simulation': return <WorkforceModulesPage type="Simulation" />
      case 'Impact': return <WorkforceModulesPage type="Impact" />
      case 'Dashboard':
      default: return <WorkforceModulesPage type="Dashboard" />
    }
  }

  const employeePage = activeTab === 'Dashboard'
    ? <EmployeeWorkspacePage />
    : activeTab === 'Competency'
      ? <EmployeeCompetencyPage />
      : activeTab === 'Verification'
        ? <EmployeeVerificationPage />
    : activeTab === 'Learning'
      ? <EmployeeLearningPage />
      : activeTab === 'Projects'
        ? <EmployeeProjectsPage />
        : <EmployeeWorkspacePage />

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      workspace={workspace}
      onWorkspaceChange={handleWorkspaceChange}
      user={currentUser}
      onLogout={handleLogout}
    >
      {workspace === 'employee' ? employeePage : renderAdminPage()}
    </AppShell>
  )
}

export default App
