import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Activity, 
  Wind, 
  Scale, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Heart,
  Zap
} from 'lucide-react'
import { API_BASE_URL } from '../config'

const MedicalExams = ({ user }) => {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [activeExamType, setActiveExamType] = useState('bioimpedancia')

  // Form states para cada tipo de exame
  const [bioimpedanciaData, setBioimpedanciaData] = useState({
    data_exame: new Date().toISOString().split('T')[0],
    peso_corporal: '',
    percentual_gordura: '',
    massa_magra: '',
    massa_gorda: '',
    agua_corporal: '',
    massa_ossea: '',
    taxa_metabolica_basal: ''
  })

  const [espirometriaData, setEspirometriaData] = useState({
    data_exame: new Date().toISOString().split('T')[0],
    cvf: '', // Capacidade Vital Forçada
    vef1: '', // Volume Expiratório Forçado no 1º segundo
    relacao_vef1_cvf: '',
    pef: '' // Pico de Fluxo Expiratório
  })

  const [vo2maxData, setVo2maxData] = useState({
    data_exame: new Date().toISOString().split('T')[0],
    vo2max: '',
    fc_max: '',
    limiar_anaerobico: '',
    limiar_ventilatório: '',
    potencia_aerobica: ''
  })

  useEffect(() => {
    if (user?.user?.id) {
      fetchExams()
    }
  }, [user])

  const fetchExams = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.user.id}/exams`)
      if (response.ok) {
        const data = await response.json()
        setExams(data.exams || [])
      }
    } catch (err) {
      console.error('Erro ao carregar exames:', err)
    }
  }

  const handleSubmitBioimpedancia = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        tipo_exame: 'bioimpedancia',
        data_exame: bioimpedanciaData.data_exame,
        dados_exame: {
          peso_corporal: parseFloat(bioimpedanciaData.peso_corporal),
          percentual_gordura: parseFloat(bioimpedanciaData.percentual_gordura),
          massa_magra: parseFloat(bioimpedanciaData.massa_magra),
          massa_gorda: parseFloat(bioimpedanciaData.massa_gorda),
          agua_corporal: parseFloat(bioimpedanciaData.agua_corporal),
          massa_ossea: parseFloat(bioimpedanciaData.massa_ossea),
          taxa_metabolica_basal: parseFloat(bioimpedanciaData.taxa_metabolica_basal)
        }
      }

      const response = await fetch(`${API_BASE_URL}/users/${user.user.id}/exams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao enviar exame')
      }

      const data = await response.json()
      setSuccess('Bioimpedância cadastrada com sucesso!')
      await fetchExams()
      
      // Reset form
      setBioimpedanciaData({
        data_exame: new Date().toISOString().split('T')[0],
        peso_corporal: '',
        percentual_gordura: '',
        massa_magra: '',
        massa_gorda: '',
        agua_corporal: '',
        massa_ossea: '',
        taxa_metabolica_basal: ''
      })

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitEspirometria = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        tipo_exame: 'espirometria',
        data_exame: espirometriaData.data_exame,
        dados_exame: {
          cvf: parseFloat(espirometriaData.cvf),
          vef1: parseFloat(espirometriaData.vef1),
          relacao_vef1_cvf: parseFloat(espirometriaData.relacao_vef1_cvf),
          pef: parseFloat(espirometriaData.pef)
        }
      }

      const response = await fetch(`${API_BASE_URL}/users/${user.user.id}/exams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao enviar exame')
      }

      setSuccess('Espirometria cadastrada com sucesso!')
      await fetchExams()
      
      setEspirometriaData({
        data_exame: new Date().toISOString().split('T')[0],
        cvf: '',
        vef1: '',
        relacao_vef1_cvf: '',
        pef: ''
      })

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitVO2Max = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        tipo_exame: 'vo2max',
        data_exame: vo2maxData.data_exame,
        dados_exame: {
          vo2max: parseFloat(vo2maxData.vo2max),
          fc_max: parseFloat(vo2maxData.fc_max),
          limiar_anaerobico: parseFloat(vo2maxData.limiar_anaerobico),
          limiar_ventilatório: parseFloat(vo2maxData.limiar_ventilatório),
          potencia_aerobica: parseFloat(vo2maxData.potencia_aerobica)
        }
      }

      const response = await fetch(`${API_BASE_URL}/users/${user.user.id}/exams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao enviar exame')
      }

      setSuccess('VO2 Máx cadastrado com sucesso!')
      await fetchExams()
      
      setVo2maxData({
        data_exame: new Date().toISOString().split('T')[0],
        vo2max: '',
        fc_max: '',
        limiar_anaerobico: '',
        limiar_ventilatório: '',
        potencia_aerobica: ''
      })

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getExamIcon = (tipo) => {
    switch (tipo) {
      case 'bioimpedancia': return <Scale className="h-5 w-5" />
      case 'espirometria': return <Wind className="h-5 w-5" />
      case 'vo2max': return <Activity className="h-5 w-5" />
      default: return <Upload className="h-5 w-5" />
    }
  }

  const getExamLabel = (tipo) => {
    switch (tipo) {
      case 'bioimpedancia': return 'Bioimpedância'
      case 'espirometria': return 'Espirometria'
      case 'vo2max': return 'VO2 Máx'
      default: return tipo
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Exames Médicos</h1>
        <p className="text-muted-foreground">
          Cadastre exames para otimizar seus treinos com base em dados científicos
        </p>
      </div>

      {/* Alertas */}
      {success && (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulários de Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Cadastrar Novo Exame</CardTitle>
            <CardDescription>
              Escolha o tipo de exame e preencha os dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeExamType} onValueChange={setActiveExamType}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="bioimpedancia">
                  <Scale className="h-4 w-4 mr-2" />
                  Bio
                </TabsTrigger>
                <TabsTrigger value="espirometria">
                  <Wind className="h-4 w-4 mr-2" />
                  Espiro
                </TabsTrigger>
                <TabsTrigger value="vo2max">
                  <Activity className="h-4 w-4 mr-2" />
                  VO2
                </TabsTrigger>
              </TabsList>

              {/* Bioimpedância */}
              <TabsContent value="bioimpedancia">
                <form onSubmit={handleSubmitBioimpedancia} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio_data">Data do Exame</Label>
                    <Input
                      id="bio_data"
                      type="date"
                      value={bioimpedanciaData.data_exame}
                      onChange={(e) => setBioimpedanciaData({ ...bioimpedanciaData, data_exame: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="peso">Peso Corporal (kg)</Label>
                      <Input
                        id="peso"
                        type="number"
                        step="0.1"
                        placeholder="70.5"
                        value={bioimpedanciaData.peso_corporal}
                        onChange={(e) => setBioimpedanciaData({ ...bioimpedanciaData, peso_corporal: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gordura">% Gordura</Label>
                      <Input
                        id="gordura"
                        type="number"
                        step="0.1"
                        placeholder="15.5"
                        value={bioimpedanciaData.percentual_gordura}
                        onChange={(e) => setBioimpedanciaData({ ...bioimpedanciaData, percentual_gordura: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="massa_magra">Massa Magra (kg)</Label>
                      <Input
                        id="massa_magra"
                        type="number"
                        step="0.1"
                        placeholder="60.0"
                        value={bioimpedanciaData.massa_magra}
                        onChange={(e) => setBioimpedanciaData({ ...bioimpedanciaData, massa_magra: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="massa_gorda">Massa Gorda (kg)</Label>
                      <Input
                        id="massa_gorda"
                        type="number"
                        step="0.1"
                        placeholder="10.5"
                        value={bioimpedanciaData.massa_gorda}
                        onChange={(e) => setBioimpedanciaData({ ...bioimpedanciaData, massa_gorda: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="agua">Água Corporal (%)</Label>
                      <Input
                        id="agua"
                        type="number"
                        step="0.1"
                        placeholder="60.0"
                        value={bioimpedanciaData.agua_corporal}
                        onChange={(e) => setBioimpedanciaData({ ...bioimpedanciaData, agua_corporal: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="massa_ossea">Massa Óssea (kg)</Label>
                      <Input
                        id="massa_ossea"
                        type="number"
                        step="0.1"
                        placeholder="3.5"
                        value={bioimpedanciaData.massa_ossea}
                        onChange={(e) => setBioimpedanciaData({ ...bioimpedanciaData, massa_ossea: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="tmb">Taxa Metabólica Basal (kcal)</Label>
                      <Input
                        id="tmb"
                        type="number"
                        step="1"
                        placeholder="1800"
                        value={bioimpedanciaData.taxa_metabolica_basal}
                        onChange={(e) => setBioimpedanciaData({ ...bioimpedanciaData, taxa_metabolica_basal: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Enviando...' : 'Cadastrar Bioimpedância'}
                  </Button>
                </form>
              </TabsContent>

              {/* Espirometria */}
              <TabsContent value="espirometria">
                <form onSubmit={handleSubmitEspirometria} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="espiro_data">Data do Exame</Label>
                    <Input
                      id="espiro_data"
                      type="date"
                      value={espirometriaData.data_exame}
                      onChange={(e) => setEspirometriaData({ ...espirometriaData, data_exame: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cvf">CVF - Capacidade Vital Forçada (L)</Label>
                      <Input
                        id="cvf"
                        type="number"
                        step="0.01"
                        placeholder="4.50"
                        value={espirometriaData.cvf}
                        onChange={(e) => setEspirometriaData({ ...espirometriaData, cvf: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vef1">VEF1 - Vol. Expiratório 1s (L)</Label>
                      <Input
                        id="vef1"
                        type="number"
                        step="0.01"
                        placeholder="3.80"
                        value={espirometriaData.vef1}
                        onChange={(e) => setEspirometriaData({ ...espirometriaData, vef1: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="relacao">Relação VEF1/CVF (%)</Label>
                      <Input
                        id="relacao"
                        type="number"
                        step="0.1"
                        placeholder="85.0"
                        value={espirometriaData.relacao_vef1_cvf}
                        onChange={(e) => setEspirometriaData({ ...espirometriaData, relacao_vef1_cvf: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pef">PEF - Pico Fluxo Exp. (L/s)</Label>
                      <Input
                        id="pef"
                        type="number"
                        step="0.1"
                        placeholder="9.5"
                        value={espirometriaData.pef}
                        onChange={(e) => setEspirometriaData({ ...espirometriaData, pef: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Enviando...' : 'Cadastrar Espirometria'}
                  </Button>
                </form>
              </TabsContent>

              {/* VO2 Máx */}
              <TabsContent value="vo2max">
                <form onSubmit={handleSubmitVO2Max} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vo2_data">Data do Exame</Label>
                    <Input
                      id="vo2_data"
                      type="date"
                      value={vo2maxData.data_exame}
                      onChange={(e) => setVo2maxData({ ...vo2maxData, data_exame: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vo2max">VO2 Máx (ml/kg/min)</Label>
                      <Input
                        id="vo2max"
                        type="number"
                        step="0.1"
                        placeholder="52.5"
                        value={vo2maxData.vo2max}
                        onChange={(e) => setVo2maxData({ ...vo2maxData, vo2max: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fc_max">FC Máxima (bpm)</Label>
                      <Input
                        id="fc_max"
                        type="number"
                        placeholder="190"
                        value={vo2maxData.fc_max}
                        onChange={(e) => setVo2maxData({ ...vo2maxData, fc_max: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="limiar_ana">Limiar Anaeróbico (ml/kg/min)</Label>
                      <Input
                        id="limiar_ana"
                        type="number"
                        step="0.1"
                        placeholder="42.0"
                        value={vo2maxData.limiar_anaerobico}
                        onChange={(e) => setVo2maxData({ ...vo2maxData, limiar_anaerobico: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="limiar_vent">Limiar Ventilatório (ml/kg/min)</Label>
                      <Input
                        id="limiar_vent"
                        type="number"
                        step="0.1"
                        placeholder="38.5"
                        value={vo2maxData.limiar_ventilatório}
                        onChange={(e) => setVo2maxData({ ...vo2maxData, limiar_ventilatório: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="potencia">Potência Aeróbica (W)</Label>
                      <Input
                        id="potencia"
                        type="number"
                        step="1"
                        placeholder="280"
                        value={vo2maxData.potencia_aerobica}
                        onChange={(e) => setVo2maxData({ ...vo2maxData, potencia_aerobica: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Enviando...' : 'Cadastrar VO2 Máx'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Histórico de Exames */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Exames</CardTitle>
            <CardDescription>
              {exams.length} exame(s) cadastrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {exams.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum exame cadastrado ainda. Use o formulário ao lado para adicionar!
              </p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {exams.slice().reverse().map((exam) => (
                  <div
                    key={exam.id}
                    className="border rounded-lg p-4 space-y-2 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getExamIcon(exam.tipo_exame)}
                        <span className="font-semibold">{getExamLabel(exam.tipo_exame)}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(exam.data_exame).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(exam.dados_exame).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/_/g, ' ')}:
                          </span>{' '}
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Scale className="h-4 w-4 mr-2 text-blue-500" />
              Bioimpedância
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Avalia composição corporal (gordura, músculo, água). Ajusta carga de treino baseado em massa magra e TMB.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Wind className="h-4 w-4 mr-2 text-green-500" />
              Espirometria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Mede capacidade pulmonar. Identifica limitações respiratórias e otimiza zonas de treino aeróbico.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Activity className="h-4 w-4 mr-2 text-red-500" />
              VO2 Máx
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Consumo máximo de oxigênio. Define limiares de treino (aeróbico/anaeróbico) com precisão científica.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default MedicalExams
