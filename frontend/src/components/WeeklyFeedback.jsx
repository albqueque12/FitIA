import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Activity, TrendingUp, Heart, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react'
import { API_BASE_URL } from '../config'

const WeeklyFeedback = ({ user }) => {
  const [formData, setFormData] = useState({
    semana: 1,
    consistencia: 0,
    rpe_medio: 5,
    fc_medio: '',
    observacoes: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [feedbackHistory, setFeedbackHistory] = useState([])
  const [currentPerformance, setCurrentPerformance] = useState(null)

  useEffect(() => {
    if (user?.user?.id) {
      fetchFeedbackHistory()
      fetchCurrentPerformance()
    }
  }, [user])

  const fetchFeedbackHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.user.id}/feedback`)
      if (response.ok) {
        const data = await response.json()
        setFeedbackHistory(data.feedbacks || [])
      }
    } catch (err) {
      console.error('Erro ao carregar histórico:', err)
    }
  }

  const fetchCurrentPerformance = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.user.id}`)
      if (response.ok) {
        const data = await response.json()
        setCurrentPerformance(data.performance_factor)
        // Calcula próxima semana automaticamente
        const nextWeek = (feedbackHistory.length || 0) + 1
        setFormData(prev => ({ ...prev, semana: nextWeek }))
      }
    } catch (err) {
      console.error('Erro ao carregar performance:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validações
      if (formData.consistencia < 0 || formData.consistencia > user.user.dias_semana) {
        throw new Error(`Consistência deve estar entre 0 e ${user.user.dias_semana} treinos`)
      }
      if (formData.rpe_medio < 1 || formData.rpe_medio > 10) {
        throw new Error('RPE deve estar entre 1 e 10')
      }

      const payload = {
        semana: parseInt(formData.semana),
        consistencia: parseInt(formData.consistencia),
        rpe_medio: parseFloat(formData.rpe_medio),
        fc_medio: formData.fc_medio ? parseFloat(formData.fc_medio) : null,
        observacoes: formData.observacoes || null
      }

      const response = await fetch(`${API_BASE_URL}/users/${user.user.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao enviar feedback')
      }

      const data = await response.json()
      setSuccess(`Feedback enviado! Novo fator de performance: ${data.new_performance_factor.toFixed(2)}`)
      
      // Atualiza histórico e reseta formulário
      await fetchFeedbackHistory()
      await fetchCurrentPerformance()
      setFormData({
        semana: formData.semana + 1,
        consistencia: 0,
        rpe_medio: 5,
        fc_medio: '',
        observacoes: ''
      })

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getRPELabel = (rpe) => {
    if (rpe <= 2) return 'Muito Fácil'
    if (rpe <= 4) return 'Fácil'
    if (rpe <= 6) return 'Moderado'
    if (rpe <= 8) return 'Difícil'
    return 'Muito Difícil'
  }

  const getPerformanceColor = (factor) => {
    if (!factor) return 'bg-gray-500'
    if (factor >= 1.1) return 'bg-green-500'
    if (factor >= 0.95) return 'bg-blue-500'
    if (factor >= 0.85) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getPerformanceLabel = (factor) => {
    if (!factor) return 'Não disponível'
    if (factor >= 1.1) return 'Excelente'
    if (factor >= 0.95) return 'Bom'
    if (factor >= 0.85) return 'Regular'
    return 'Precisa ajustar'
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header com Performance Atual */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feedback Semanal</h1>
          <p className="text-muted-foreground">
            Ajuste seus treinos baseado no seu desempenho
          </p>
        </div>
        {currentPerformance && (
          <Badge className={`${getPerformanceColor(currentPerformance)} text-white text-lg px-4 py-2`}>
            Performance: {currentPerformance.toFixed(2)} - {getPerformanceLabel(currentPerformance)}
          </Badge>
        )}
      </div>

      {/* Alertas */}
      {success && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-700">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-500 bg-red-50 dark:bg-red-950 dark:border-red-700">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle>Enviar Feedback da Semana</CardTitle>
            <CardDescription>
              Preencha suas informações de treino para ajustar a intensidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Semana */}
              <div className="space-y-2">
                <Label htmlFor="semana">
                  <Activity className="inline mr-2 h-4 w-4" />
                  Semana de Treino
                </Label>
                <Input
                  id="semana"
                  type="number"
                  min="1"
                  value={formData.semana}
                  onChange={(e) => setFormData({ ...formData, semana: e.target.value })}
                  required
                />
              </div>

              {/* Consistência */}
              <div className="space-y-2">
                <Label htmlFor="consistencia">
                  <CheckCircle className="inline mr-2 h-4 w-4" />
                  Treinos Completados (de {user?.user?.dias_semana || 0})
                </Label>
                <Input
                  id="consistencia"
                  type="number"
                  min="0"
                  max={user?.user?.dias_semana || 7}
                  value={formData.consistencia}
                  onChange={(e) => setFormData({ ...formData, consistencia: e.target.value })}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Quantos treinos você conseguiu completar essa semana?
                </p>
              </div>

              {/* RPE Médio */}
              <div className="space-y-2">
                <Label htmlFor="rpe_medio">
                  <TrendingUp className="inline mr-2 h-4 w-4" />
                  RPE Médio: {formData.rpe_medio} - {getRPELabel(formData.rpe_medio)}
                </Label>
                <Input
                  id="rpe_medio"
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={formData.rpe_medio}
                  onChange={(e) => setFormData({ ...formData, rpe_medio: e.target.value })}
                  className="w-full"
                  required
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 - Muito Fácil</span>
                  <span>10 - Muito Difícil</span>
                </div>
              </div>

              {/* FC Média (Opcional) */}
              <div className="space-y-2">
                <Label htmlFor="fc_medio">
                  <Heart className="inline mr-2 h-4 w-4" />
                  Frequência Cardíaca Média (opcional)
                </Label>
                <Input
                  id="fc_medio"
                  type="number"
                  min="40"
                  max="220"
                  placeholder="Ex: 150 bpm"
                  value={formData.fc_medio}
                  onChange={(e) => setFormData({ ...formData, fc_medio: e.target.value })}
                />
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="observacoes">
                  <MessageSquare className="inline mr-2 h-4 w-4" />
                  Observações (opcional)
                </Label>
                <Textarea
                  id="observacoes"
                  placeholder="Como você se sentiu? Alguma dificuldade ou lesão?"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Feedback'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Histórico de Feedbacks */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Feedbacks</CardTitle>
            <CardDescription>
              {feedbackHistory.length} feedback(s) enviado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {feedbackHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum feedback enviado ainda. Comece preenchendo o formulário!
              </p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {feedbackHistory.slice().reverse().map((feedback) => (
                  <div
                    key={feedback.id}
                    className="border rounded-lg p-4 space-y-2 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Semana {feedback.semana}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(feedback.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Consistência:</span>{' '}
                        <span className="font-medium">{feedback.consistencia} treinos</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">RPE:</span>{' '}
                        <span className="font-medium">{feedback.rpe_medio.toFixed(1)}</span>
                      </div>
                      {feedback.fc_medio && (
                        <div>
                          <span className="text-muted-foreground">FC:</span>{' '}
                          <span className="font-medium">{feedback.fc_medio.toFixed(0)} bpm</span>
                        </div>
                      )}
                    </div>
                    {feedback.observacoes && (
                      <p className="text-sm text-muted-foreground italic">
                        "{feedback.observacoes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Card Explicativo */}
      <Card>
        <CardHeader>
          <CardTitle>Como Funciona o Feedback Adaptativo?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Consistência (30%)
              </h4>
              <p className="text-sm text-muted-foreground">
                Quantos treinos você completou vs planejados. Maior consistência = treinos mais desafiadores.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
                RPE - Esforço Percebido (40%)
              </h4>
              <p className="text-sm text-muted-foreground">
                RPE &lt; 4: Treinos muito fáceis (+15% intensidade)<br />
                RPE &gt; 8: Treinos muito difíceis (-15% intensidade)
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center">
                <Heart className="mr-2 h-5 w-5 text-red-500" />
                Frequência Cardíaca (30%)
              </h4>
              <p className="text-sm text-muted-foreground">
                Se a FC está muito alta ou baixa durante os treinos, ajustamos automaticamente.
              </p>
            </div>
          </div>
          <Alert>
            <AlertDescription>
              <strong>Dica:</strong> Seja honesto no feedback! A IA aprende com suas respostas e ajusta os treinos para seu nível atual.
              O fator de performance varia entre 0.7x (redução) e 1.3x (aumento).
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

export default WeeklyFeedback
