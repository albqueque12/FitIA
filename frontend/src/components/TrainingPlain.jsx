import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Calendar, Play, CheckCircle, Clock, Target, Plus, MessageSquare } from 'lucide-react'
import { API_BASE_URL } from '../config'

const TrainingPlan = ({ user }) => {
  const [trainingPlans, setTrainingPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [completionData, setCompletionData] = useState({
    rpe_realizado: '',
    fc_media: '',
    tempo_realizado: ''
  })
  const [feedbackData, setFeedbackData] = useState({
    semana: '',
    consistencia: '',
    rpe_medio: '',
    fc_medio: '',
    observacoes: ''
  })

  useEffect(() => {
    fetchTrainingPlans()
  }, [user])

  const fetchTrainingPlans = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.user.id}/training-plans`)
      if (!response.ok) throw new Error('Erro ao carregar planos')
      
      const data = await response.json()
      setTrainingPlans(data.training_plans)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const generateWeekPlan = async (weekNumber) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.user.id}/training-plan/${weekNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) throw new Error('Erro ao gerar plano')
      
      fetchTrainingPlans()
    } catch (err) {
      setError(err.message)
    }
  }

  const completeWorkout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/workouts/${selectedWorkout.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rpe_realizado: parseInt(completionData.rpe_realizado),
          fc_media: parseFloat(completionData.fc_media),
          tempo_realizado: parseFloat(completionData.tempo_realizado)
        }),
      })
      
      if (!response.ok) throw new Error('Erro ao marcar treino como completo')
      
      setSelectedWorkout(null)
      setCompletionData({ rpe_realizado: '', fc_media: '', tempo_realizado: '' })
      fetchTrainingPlans()
    } catch (err) {
      setError(err.message)
    }
  }

  const submitFeedback = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.user.id}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          semana: parseInt(feedbackData.semana),
          consistencia: parseInt(feedbackData.consistencia),
          rpe_medio: parseFloat(feedbackData.rpe_medio),
          fc_medio: parseFloat(feedbackData.fc_medio),
          observacoes: feedbackData.observacoes
        }),
      })
      
      if (!response.ok) throw new Error('Erro ao enviar feedback')
      
      setFeedbackData({ semana: '', consistencia: '', rpe_medio: '', fc_medio: '', observacoes: '' })
      alert('Feedback enviado com sucesso! Seus próximos treinos serão ajustados.')
    } catch (err) {
      setError(err.message)
    }
  }

  const formatPace = (paceMinKm) => {
    const minutes = Math.floor(paceMinKm)
    const seconds = Math.floor((paceMinKm - minutes) * 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getWorkoutTypeColor = (type) => {
    const colors = {
      'regenerativo': 'bg-green-100 text-green-800',
      'fácil': 'bg-blue-100 text-blue-800',
      'longo': 'bg-purple-100 text-purple-800',
      'progressivo': 'bg-yellow-100 text-yellow-800',
      'fartlek': 'bg-orange-100 text-orange-800',
      'tempo': 'bg-red-100 text-red-800',
      'intervalo': 'bg-pink-100 text-pink-800',
      'ritmo': 'bg-indigo-100 text-indigo-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getPhaseColor = (phase) => {
    const colors = {
      'base': 'bg-green-100 text-green-800',
      'construção': 'bg-blue-100 text-blue-800',
      'intensificação': 'bg-red-100 text-red-800',
      'tapering': 'bg-purple-100 text-purple-800'
    }
    return colors[phase] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Calendar className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Planos de Treino</h2>
          <p className="text-gray-600">Gerencie seus treinos semanais</p>
        </div>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Enviar Feedback
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Feedback Semanal</DialogTitle>
                <DialogDescription>
                  Avalie sua semana de treinos para que a IA possa ajustar seus próximos planos
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Semana</Label>
                    <Input
                      type="number"
                      placeholder="Ex: 1"
                      value={feedbackData.semana}
                      onChange={(e) => setFeedbackData(prev => ({...prev, semana: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label>Treinos Completados</Label>
                    <Input
                      type="number"
                      placeholder="Ex: 3"
                      value={feedbackData.consistencia}
                      onChange={(e) => setFeedbackData(prev => ({...prev, consistencia: e.target.value}))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>RPE Médio (1-10)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Ex: 6.5"
                      value={feedbackData.rpe_medio}
                      onChange={(e) => setFeedbackData(prev => ({...prev, rpe_medio: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label>FC Média (bpm)</Label>
                    <Input
                      type="number"
                      placeholder="Ex: 160"
                      value={feedbackData.fc_medio}
                      onChange={(e) => setFeedbackData(prev => ({...prev, fc_medio: e.target.value}))}
                    />
                  </div>
                </div>
                <div>
                  <Label>Observações</Label>
                  <Textarea
                    placeholder="Como se sentiu durante os treinos?"
                    value={feedbackData.observacoes}
                    onChange={(e) => setFeedbackData(prev => ({...prev, observacoes: e.target.value}))}
                  />
                </div>
                <Button onClick={submitFeedback} className="w-full">
                  Enviar Feedback
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button onClick={() => generateWeekPlan(trainingPlans.length + 1)}>
            <Plus className="h-4 w-4 mr-2" />
            Gerar Próxima Semana
          </Button>
        </div>
      </div>

      {/* Lista de Planos */}
      {trainingPlans.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum plano criado ainda</h3>
            <p className="text-gray-600 mb-4">Comece gerando seu primeiro plano de treino</p>
            <Button onClick={() => generateWeekPlan(1)}>
              <Plus className="h-4 w-4 mr-2" />
              Gerar Semana 1
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {trainingPlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Semana {plan.semana}
                    </CardTitle>
                    <CardDescription>{plan.fase_desc}</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getPhaseColor(plan.fase)}>
                      {plan.fase}
                    </Badge>
                    <Badge variant="outline">
                      {plan.volume_total.toFixed(1)}km total
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {plan.workouts.map((workout) => (
                    <Card key={workout.id} className="relative">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Badge className={getWorkoutTypeColor(workout.tipo)}>
                            {workout.tipo}
                          </Badge>
                          {workout.completed && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">Dia {workout.dia}</p>
                          <p className="text-sm text-gray-600">{workout.distancia_km}km</p>
                          <p className="text-sm text-gray-600">
                            Ritmo: {workout.ritmo_formatado}/km
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {workout.descricao}
                          </p>
                        </div>
                        {!workout.completed && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                className="w-full mt-3"
                                onClick={() => setSelectedWorkout(workout)}
                              >
                                <Play className="h-4 w-4 mr-1" />
                                Completar
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Completar Treino</DialogTitle>
                                <DialogDescription>
                                  {workout.tipo} - {workout.distancia_km}km
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Esforço Percebido (1-10)</Label>
                                  <Select 
                                    value={completionData.rpe_realizado} 
                                    onValueChange={(value) => setCompletionData(prev => ({...prev, rpe_realizado: value}))}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Frequência Cardíaca Média (bpm)</Label>
                                  <Input
                                    type="number"
                                    placeholder="Ex: 160"
                                    value={completionData.fc_media}
                                    onChange={(e) => setCompletionData(prev => ({...prev, fc_media: e.target.value}))}
                                  />
                                </div>
                                <div>
                                  <Label>Tempo Realizado (minutos)</Label>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    placeholder="Ex: 25.5"
                                    value={completionData.tempo_realizado}
                                    onChange={(e) => setCompletionData(prev => ({...prev, tempo_realizado: e.target.value}))}
                                  />
                                </div>
                                <Button onClick={completeWorkout} className="w-full">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Marcar como Completo
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        {workout.completed && (
                          <div className="mt-3 text-xs text-gray-500">
                            <p>RPE: {workout.rpe_realizado}</p>
                            <p>FC: {workout.fc_media} bpm</p>
                            <p>Tempo: {workout.tempo_realizado}min</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default TrainingPlan

