import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress as ProgressBar } from '@/components/ui/progress.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Calendar, Activity, Target, Award, Zap } from 'lucide-react'
import { API_BASE_URL } from '../config'
import { useRefresh } from '../context/RefreshContext'

const Progress = ({ user }) => {
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { refreshTrigger } = useRefresh()

  useEffect(() => {
    fetchProgress()
  }, [user, refreshTrigger])

  const fetchProgress = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.user.id}/progress`)
      if (!response.ok) throw new Error('Erro ao carregar progresso')
      
      const data = await response.json()
      setProgress(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatPace = (paceMinKm) => {
    const minutes = Math.floor(paceMinKm)
    const seconds = Math.floor((paceMinKm - minutes) * 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-blue-600'
    if (percentage >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPerformanceStatus = (factor) => {
    if (factor > 1.1) return { status: 'Excelente', color: 'bg-green-100 text-green-800' }
    if (factor > 1.0) return { status: 'Bom', color: 'bg-blue-100 text-blue-800' }
    if (factor > 0.9) return { status: 'Normal', color: 'bg-yellow-100 text-yellow-800' }
    return { status: 'Precisa Ajustar', color: 'bg-red-100 text-red-800' }
  }

  // Preparar dados para gráficos
  const feedbackChartData = progress?.recent_feedback.map((feedback, index) => ({
    semana: `S${feedback.semana}`,
    rpe: feedback.rpe_medio,
    consistencia: (feedback.consistencia / user.user.dias_semana) * 100,
    fc: feedback.fc_medio
  })).reverse() || []

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <TrendingUp className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const performanceStatus = getPerformanceStatus(user.user.performance_factor)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Progresso e Estatísticas</h2>
        <p className="text-muted-foreground">Acompanhe sua evolução e performance</p>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Progresso Geral</p>
                <p className={`text-2xl font-bold ${getProgressColor(progress?.statistics.progress_percentage)}`}>
                  {progress?.statistics.progress_percentage.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Taxa de Conclusão</p>
                <p className="text-2xl font-bold text-green-900">
                  {Math.round(progress?.statistics.completion_rate || 0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Semanas Ativas</p>
                <p className="text-2xl font-bold text-purple-900">
                  {progress?.statistics.total_plans || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Performance</p>
                <Badge className={performanceStatus.color}>
                  {performanceStatus.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progresso do Objetivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Progresso do Objetivo
          </CardTitle>
          <CardDescription>
            Meta: {user.user.distancia_objetivo}km em {Math.floor(user.user.tempo_objetivo_min / 60)}h{user.user.tempo_objetivo_min % 60}min
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progresso do Plano</span>
                <span>{progress?.statistics.progress_percentage.toFixed(1)}%</span>
              </div>
              <ProgressBar value={progress?.statistics.progress_percentage || 0} className="w-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Ritmo Atual</p>
                <p className="text-xl font-bold text-blue-900">
                  {formatPace(user.ritmos.ritmo_facil)}/km
                </p>
                <p className="text-xs text-blue-600">Ritmo Fácil</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800">Ritmo Objetivo</p>
                <p className="text-xl font-bold text-green-900">
                  {formatPace(user.ritmos.ritmo_objetivo)}/km
                </p>
                <p className="text-xs text-green-600">Meta Final</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-purple-800">Diferença</p>
                <p className="text-xl font-bold text-purple-900">
                  {formatPace(Math.abs(user.ritmos.ritmo_facil - user.ritmos.ritmo_objetivo))}/km
                </p>
                <p className="text-xs text-purple-600">Para Melhorar</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos de Evolução */}
      {feedbackChartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Evolução do RPE</CardTitle>
              <CardDescription>
                Percepção de esforço ao longo das semanas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={feedbackChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semana" />
                  <YAxis domain={[1, 10]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="rpe" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consistência dos Treinos</CardTitle>
              <CardDescription>
                Porcentagem de treinos completados por semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={feedbackChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semana" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Consistência']} />
                  <Bar dataKey="consistencia" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Histórico de Feedback */}
      {progress?.recent_feedback && progress.recent_feedback.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Feedback</CardTitle>
            <CardDescription>
              Suas avaliações semanais mais recentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progress.recent_feedback.map((feedback, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">Semana {feedback.semana}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {feedback.consistencia}/{user.user.dias_semana} treinos
                      </span>
                      <span className="text-sm text-muted-foreground">
                        RPE: {feedback.rpe_medio}
                      </span>
                      {feedback.fc_medio && (
                        <span className="text-sm text-muted-foreground">
                          FC: {feedback.fc_medio} bpm
                        </span>
                      )}
                    </div>
                    {feedback.observacoes && (
                      <p className="text-sm text-muted-foreground mt-2">
                        "{feedback.observacoes}"
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge 
                      className={
                        feedback.rpe_medio <= 5 ? 'bg-green-100 text-green-800' :
                        feedback.rpe_medio <= 7 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {feedback.rpe_medio <= 5 ? 'Leve' :
                       feedback.rpe_medio <= 7 ? 'Moderado' : 'Intenso'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dicas de Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Análise de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">Fator de Performance Atual</span>
              <Badge className={performanceStatus.color}>
                {(user.user.performance_factor * 100).toFixed(0)}%
              </Badge>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-2">
              {user.user.performance_factor > 1.1 && (
                <p className="text-green-700 bg-green-50 p-2 rounded">
                  ✅ Excelente! Você está superando as expectativas. Continue assim!
                </p>
              )}
              {user.user.performance_factor <= 1.1 && user.user.performance_factor > 1.0 && (
                <p className="text-blue-700 bg-blue-50 p-2 rounded">
                  👍 Bom desempenho! Seus treinos estão progredindo bem.
                </p>
              )}
              {user.user.performance_factor <= 1.0 && user.user.performance_factor > 0.9 && (
                <p className="text-yellow-700 bg-yellow-50 p-2 rounded">
                  ⚠️ Performance normal. Continue consistente para melhorar.
                </p>
              )}
              {user.user.performance_factor <= 0.9 && (
                <p className="text-red-700 bg-red-50 p-2 rounded">
                  🔄 Seus treinos foram ajustados para facilitar a recuperação. Foque na consistência.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default Progress

