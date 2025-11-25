import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Loader2, User, Target, Activity } from 'lucide-react'

const UserRegistration = ({ onUserCreated }) => {
  const [formData, setFormData] = useState({
    idade: '',
    peso: '',
    sexo: '',
    nivel: '',
    distancia_objetivo: '',
    tempo_objetivo_horas: '',
    tempo_objetivo_minutos: '',
    semanas_treino: '',
    dias_semana: '',
    teste_5km_tempo: '',
    teste_5km_fc_media: '',
    teste_5km_rpe: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateStep1 = () => {
    return formData.idade && formData.peso && formData.sexo && formData.nivel
  }

  const validateStep2 = () => {
    return formData.distancia_objetivo && formData.tempo_objetivo_horas && 
           formData.tempo_objetivo_minutos && formData.semanas_treino && formData.dias_semana
  }

  const validateStep3 = () => {
    return formData.teste_5km_tempo && formData.teste_5km_fc_media && formData.teste_5km_rpe
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Converter tempo objetivo para minutos
      const tempo_objetivo_min = parseInt(formData.tempo_objetivo_horas) * 60 + parseInt(formData.tempo_objetivo_minutos)
      
      const userData = {
        idade: parseInt(formData.idade),
        peso: parseFloat(formData.peso),
        sexo: formData.sexo,
        nivel: formData.nivel,
        distancia_objetivo: parseFloat(formData.distancia_objetivo),
        tempo_objetivo_min: tempo_objetivo_min,
        semanas_treino: parseInt(formData.semanas_treino),
        dias_semana: parseInt(formData.dias_semana),
        teste_5km_tempo: parseFloat(formData.teste_5km_tempo),
        teste_5km_fc_media: parseFloat(formData.teste_5km_fc_media),
        teste_5km_rpe: parseInt(formData.teste_5km_rpe)
      }

      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar usuário')
      }

      const result = await response.json()
      onUserCreated(result)
    } catch (err) {
      setError(err.message || 'Erro ao criar usuário')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2)
    else if (step === 2 && validateStep2()) setStep(3)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-6 w-6 mr-2" />
            Configuração Inicial - Passo {step} de 3
          </CardTitle>
          <CardDescription>
            {step === 1 && "Vamos começar com suas informações básicas"}
            {step === 2 && "Agora defina seus objetivos de treino"}
            {step === 3 && "Por último, precisamos avaliar seu condicionamento atual"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Passo 1: Informações Pessoais */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="idade">Idade</Label>
                    <Input
                      id="idade"
                      type="number"
                      placeholder="Ex: 30"
                      value={formData.idade}
                      onChange={(e) => handleInputChange('idade', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="peso">Peso (kg)</Label>
                    <Input
                      id="peso"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 75.5"
                      value={formData.peso}
                      onChange={(e) => handleInputChange('peso', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sexo">Sexo</Label>
                    <Select value={formData.sexo} onValueChange={(value) => handleInputChange('sexo', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="nivel">Nível de Experiência</Label>
                    <Select value={formData.nivel} onValueChange={(value) => handleInputChange('nivel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iniciante">Iniciante</SelectItem>
                        <SelectItem value="intermediário">Intermediário</SelectItem>
                        <SelectItem value="avançado">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Passo 2: Objetivos */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="distancia">Distância Objetivo (km)</Label>
                    <Input
                      id="distancia"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 10"
                      value={formData.distancia_objetivo}
                      onChange={(e) => handleInputChange('distancia_objetivo', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tempo_h">Tempo Objetivo (horas)</Label>
                    <Input
                      id="tempo_h"
                      type="number"
                      placeholder="Ex: 0"
                      value={formData.tempo_objetivo_horas}
                      onChange={(e) => handleInputChange('tempo_objetivo_horas', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tempo_m">Tempo Objetivo (minutos)</Label>
                    <Input
                      id="tempo_m"
                      type="number"
                      placeholder="Ex: 45"
                      value={formData.tempo_objetivo_minutos}
                      onChange={(e) => handleInputChange('tempo_objetivo_minutos', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="semanas">Duração do Plano (semanas)</Label>
                    <Input
                      id="semanas"
                      type="number"
                      placeholder="Ex: 12"
                      value={formData.semanas_treino}
                      onChange={(e) => handleInputChange('semanas_treino', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dias">Dias de Treino por Semana</Label>
                    <Select value={formData.dias_semana} onValueChange={(value) => handleInputChange('dias_semana', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 dias</SelectItem>
                        <SelectItem value="4">4 dias</SelectItem>
                        <SelectItem value="5">5 dias</SelectItem>
                        <SelectItem value="6">6 dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Passo 3: Teste de Performance */}
            {step === 3 && (
              <div className="space-y-4">
                <Alert>
                  <Activity className="h-4 w-4" />
                  <AlertDescription>
                    Para personalizar seus treinos, precisamos de dados do seu teste de 5km. 
                    Se você não fez recentemente, faça uma corrida de 5km no seu ritmo confortável.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="tempo_5km">Tempo 5km (minutos)</Label>
                    <Input
                      id="tempo_5km"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 25.5"
                      value={formData.teste_5km_tempo}
                      onChange={(e) => handleInputChange('teste_5km_tempo', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="fc_media">FC Média (bpm)</Label>
                    <Input
                      id="fc_media"
                      type="number"
                      placeholder="Ex: 165"
                      value={formData.teste_5km_fc_media}
                      onChange={(e) => handleInputChange('teste_5km_fc_media', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="rpe">Esforço Percebido (1-10)</Label>
                    <Select value={formData.teste_5km_rpe} onValueChange={(value) => handleInputChange('teste_5km_rpe', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8,9,10].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num} - {
                            num <= 3 ? 'Muito Fácil' :
                            num <= 5 ? 'Fácil' :
                            num <= 7 ? 'Moderado' :
                            num <= 9 ? 'Difícil' : 'Máximo'
                          }</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
              >
                Anterior
              </Button>
              
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (step === 1 && !validateStep1()) ||
                    (step === 2 && !validateStep2())
                  }
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading || !validateStep3()}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Criar Perfil
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserRegistration

