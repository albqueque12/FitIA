import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Target, Calendar, TrendingUp, Clock, Activity, Zap } from 'lucide-react'
import { API_BASE_URL } from '../config'

const Dashboard = ({ user }) => {
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProgress()
  }, [user])

  const fetchProgress = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.user.id}/progress`)
      if (!response.ok) throw new Error('Erro ao buscar progresso')
      
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

  const generateFirstWeekPlan = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.user.id}/training-plan/1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) throw new Error('Erro ao gerar plano')
      
      // Recarregar progresso após gerar plano
      fetchProgress()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Activity className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com objetivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-6 w-6 mr-2 text-blue-600" />
            Seu Objetivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {user.user.distancia_objetivo}km em {Math.floor(user.user.tempo_objetivo_min / 60)}h{user.user.tempo_objetivo_min % 60}min
              </p>
              <p className="text-gray-600">
                Ritmo objetivo: {formatPace(user.ritmos.ritmo_objetivo)}/km
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {user.user.nivel}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Semanas Planejadas</p>
                <p className="text-2xl font-bold">{progress?.statistics.total_plans || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Treinos Completos</p>
                <p className="text-2xl font-bold">{progress?.statistics.completed_workouts || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taxa de Conclusão</p>
                <p className="text-2xl font-bold">{Math.round(progress?.statistics.completion_rate || 0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Performance</p>
                <p className="text-2xl font-bold">{(user.user.performance_factor * 100).toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progresso Geral */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso do Plano</CardTitle>
          <CardDescription>
            {progress?.statistics.progress_percentage.toFixed(1)}% concluído do seu plano de {user.user.semanas_treino} semanas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress?.statistics.progress_percentage || 0} className="w-full" />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Semana 1</span>
            <span>Semana {user.user.semanas_treino}</span>
          </div>
        </CardContent>
      </Card>

      {/* Ritmos de Treino */}
      <Card>
        <CardHeader>
          <CardTitle>Seus Ritmos de Treino</CardTitle>
          <CardDescription>
            Ritmos calculados baseados no seu teste de 5km
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-800">Regenerativo</p>
              <p className="text-lg font-bold text-green-900">{formatPace(user.ritmos.ritmo_facil * 1.1)}/km</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800">Fácil</p>
              <p className="text-lg font-bold text-blue-900">{formatPace(user.ritmos.ritmo_facil)}/km</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-800">Tempo</p>
              <p className="text-lg font-bold text-purple-900">{formatPace(user.ritmos.ritmo_tempo)}/km</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-sm font-medium text-red-800">Intervalo</p>
              <p className="text-lg font-bold text-red-900">{formatPace(user.ritmos.ritmo_intervalo)}/km</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ação rápida */}
      {progress?.statistics.total_plans === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Comece Agora!</CardTitle>
            <CardDescription>
              Gere seu primeiro plano de treino personalizado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={generateFirstWeekPlan} className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Gerar Plano da Semana 1
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Feedback Recente */}
      {progress?.recent_feedback && progress.recent_feedback.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Feedback Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {progress.recent_feedback.slice(0, 3).map((feedback, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Semana {feedback.semana}</p>
                    <p className="text-sm text-gray-600">
                      {feedback.consistencia} treinos • RPE médio: {feedback.rpe_medio}
                    </p>
                  </div>
                  <Badge variant={feedback.rpe_medio <= 6 ? "default" : "destructive"}>
                    {feedback.rpe_medio <= 6 ? "Boa" : "Intensa"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default Dashboard

