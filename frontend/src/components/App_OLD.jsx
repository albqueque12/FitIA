import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Activity, Target, Calendar, TrendingUp, User, Settings, Moon, Sun } from 'lucide-react'
import { ThemeProvider, useTheme } from '../context/ThemeContext'
import UserRegistration from './UserRegistration'
import Dashboard from './Dashboard'
import TrainingPlan from './TrainingPlain'
import Progress from './Progress'
import '../App.css'

function AppContent() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('fitai_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const handleUserCreated = (userData) => {
    setUser(userData)
    localStorage.setItem('fitai_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('fitai_user')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Activity className="h-12 w-12 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">FitAI</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Treinos personalizados com Inteligência Artificial. 
              Configure seus objetivos e deixe nossa IA criar o plano perfeito para você.
            </p>
          </div>
          <UserRegistration onUserCreated={handleUserCreated} />
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">FitAI</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Olá, {user.user?.nivel || 'Usuário'}!
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white border-b">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
                <TabsTrigger value="dashboard" className="flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="training" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Treinos
                </TabsTrigger>
                <TabsTrigger value="progress" className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Progresso
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Perfil
                </TabsTrigger>
              </TabsList>

              <div className="py-6">
                <TabsContent value="dashboard">
                  <Dashboard user={user} />
                </TabsContent>
                <TabsContent value="training">
                  <TrainingPlan user={user} />
                </TabsContent>
                <TabsContent value="progress">
                  <Progress user={user} />
                </TabsContent>
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Perfil do Usuário
                      </CardTitle>
                      <CardDescription>
                        Suas informações e configurações
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Idade</label>
                          <p className="text-lg">{user.user?.idade} anos</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Peso</label>
                          <p className="text-lg">{user.user?.peso} kg</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Nível</label>
                          <p className="text-lg capitalize">{user.user?.nivel}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Objetivo</label>
                          <p className="text-lg">{user.user?.distancia_objetivo}km em {Math.floor(user.user?.tempo_objetivo_min / 60)}h{user.user?.tempo_objetivo_min % 60}min</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Dias por semana</label>
                          <p className="text-lg">{user.user?.dias_semana} dias</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Duração do plano</label>
                          <p className="text-lg">{user.user?.semanas_treino} semanas</p>
                        </div>
                      </div>
                      <div className="mt-6">
                        <Button variant="outline" onClick={handleLogout}>
                          <Settings className="h-4 w-4 mr-2" />
                          Reconfigurar Perfil
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </nav>
      </div>
    </Router>
  )
}

export default App

