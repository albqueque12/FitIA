import numpy as np
import pandas as pd
import random
import json
from datetime import datetime, timedelta
from src.models.user import User, TrainingPlan, Workout, UserFeedback, UserExam, db

class TrainingAIService:
    def __init__(self):
        self.training_types = {
            'base': ['fácil', 'longo', 'progressivo', 'fartlek', 'regenerativo'],
            'construção': ['fácil', 'longo', 'tempo', 'intervalo', 'progressivo', 'regenerativo'],
            'intensificação': ['fácil', 'longo', 'tempo', 'intervalo', 'ritmo', 'regenerativo'],
            'tapering': ['fácil', 'longo', 'tempo', 'regenerativo', 'fartlek']
        }
    
    def calculate_training_paces(self, user_data):
        """Calcula os ritmos de treino baseado no teste de 5km e objetivo"""
        tempo_5km = user_data['teste_5km_tempo']
        ritmo_5km = tempo_5km / 5  # min/km
        ritmo_objetivo = user_data['tempo_objetivo_min'] / user_data['distancia_objetivo']
        
        # Fórmula adaptativa baseada no objetivo
        diff_factor = ritmo_objetivo / ritmo_5km
        
        # Ajustar fatores com base na diferença entre atual e objetivo
        if diff_factor > 1.2:
            # Objetivo muito mais lento que atual - iniciante
            ritmo_facil = ritmo_5km * 1.15
            ritmo_longo = ritmo_5km * 1.1
            ritmo_tempo = ritmo_5km * 0.95
            ritmo_intervalo = ritmo_5km * 0.85
            ritmo_limiar = ritmo_5km * 0.9
            ritmo_ritmo = ritmo_objetivo
        elif diff_factor < 0.9:
            # Objetivo mais rápido que atual - avançado
            ritmo_facil = ritmo_objetivo * 1.3
            ritmo_longo = ritmo_objetivo * 1.2
            ritmo_tempo = ritmo_objetivo * 1.05
            ritmo_intervalo = ritmo_objetivo * 0.9
            ritmo_limiar = ritmo_objetivo
            ritmo_ritmo = ritmo_objetivo * 0.95
        else:
            # Objetivo próximo do atual
            ritmo_facil = ritmo_5km * 1.2
            ritmo_longo = ritmo_5km * 1.15
            ritmo_tempo = ritmo_5km * 0.95
            ritmo_intervalo = ritmo_5km * 0.85
            ritmo_limiar = ritmo_5km * 0.9
            ritmo_ritmo = ritmo_objetivo
        
        return {
            'ritmo_facil': ritmo_facil,
            'ritmo_longo': ritmo_longo,
            'ritmo_tempo': ritmo_tempo,
            'ritmo_intervalo': ritmo_intervalo,
            'ritmo_limiar': ritmo_limiar,
            'ritmo_ritmo': ritmo_ritmo,
            'ritmo_objetivo': ritmo_objetivo
        }
    
    def get_training_phase(self, week_number, total_weeks):
        """Define a fase de treinamento baseado na semana"""
        if week_number <= total_weeks * 0.25:
            return "base", 0.7, 0.8, "Desenvolvimento da resistência básica"
        elif week_number <= total_weeks * 0.6:
            return "construção", 0.9, 1.0, "Aumento de volume e intensidade"
        elif week_number <= total_weeks * 0.85:
            return "intensificação", 1.0, 1.1, "Trabalho específico de ritmo"
        else:
            return "tapering", 0.6, 0.7, "Redução de volume para recuperação"
    
    def generate_workout(self, workout_type, week_number, phase, volume_semanal, ritmos, performance_factor):
        """Gera diferentes tipos de treino baseado no tipo especificado"""
        # Volume base para cada tipo de treino
        base_volumes = {
            'regenerativo': volume_semanal * 0.15,
            'fácil': volume_semanal * 0.2,
            'longo': volume_semanal * 0.35,
            'progressivo': volume_semanal * 0.25,
            'fartlek': volume_semanal * 0.25,
            'tempo': volume_semanal * 0.2,
            'intervalo': volume_semanal * 0.15,
            'ritmo': volume_semanal * 0.2
        }
        
        # Definir treinos específicos para cada tipo
        workouts = {
            'regenerativo': {
                'tipo': 'regenerativo',
                'descricao': 'Corrida regenerativa para recuperação ativa',
                'distancia_km': base_volumes['regenerativo'] * performance_factor,
                'ritmo_alvo': ritmos['ritmo_facil'] * 1.1
            },
            'fácil': {
                'tipo': 'fácil',
                'descricao': 'Corrida contínua em ritmo conversável',
                'distancia_km': base_volumes['fácil'] * performance_factor,
                'ritmo_alvo': ritmos['ritmo_facil']
            },
            'longo': {
                'tipo': 'longo',
                'descricao': 'Corrida longa para desenvolvimento de resistência',
                'distancia_km': base_volumes['longo'] * performance_factor,
                'ritmo_alvo': ritmos['ritmo_longo']
            },
            'progressivo': {
                'tipo': 'progressivo',
                'descricao': 'Corrida que inicia fácil e termina em ritmo moderado',
                'distancia_km': base_volumes['progressivo'] * performance_factor,
                'ritmo_alvo': (ritmos['ritmo_facil'] + ritmos['ritmo_tempo']) / 2
            },
            'fartlek': {
                'tipo': 'fartlek',
                'descricao': 'Treino de velocidade com variações de ritmo livre',
                'distancia_km': base_volumes['fartlek'] * performance_factor,
                'ritmo_alvo': ritmos['ritmo_intervalo']
            },
            'tempo': {
                'tipo': 'tempo',
                'descricao': 'Treino contínuo no limiar de lactato',
                'distancia_km': base_volumes['tempo'] * performance_factor,
                'ritmo_alvo': ritmos['ritmo_tempo']
            },
            'intervalo': {
                'tipo': 'intervalo',
                'descricao': 'Repetições de alta intensidade com recuperação',
                'distancia_km': base_volumes['intervalo'] * performance_factor,
                'ritmo_alvo': ritmos['ritmo_intervalo']
            },
            'ritmo': {
                'tipo': 'ritmo',
                'descricao': 'Treino específico no ritmo de prova',
                'distancia_km': base_volumes['ritmo'] * performance_factor,
                'ritmo_alvo': ritmos['ritmo_ritmo']
            }
        }
        
        # Ajustar baseado na fase de treinamento
        if phase == "base":
            workouts['longo']['distancia_km'] *= 0.9
            workouts['ritmo']['distancia_km'] *= 0.7
        elif phase == "construção":
            workouts['longo']['distancia_km'] *= 1.0
            workouts['ritmo']['distancia_km'] *= 0.8
        elif phase == "intensificação":
            workouts['longo']['distancia_km'] *= 1.1
            workouts['ritmo']['distancia_km'] *= 1.0
        else:  # tapering
            workouts['longo']['distancia_km'] *= 0.7
            workouts['ritmo']['distancia_km'] *= 0.8
        
        # Garantir que a distância mínima seja respeitada
        for workout in workouts.values():
            workout['distancia_km'] = max(3.0, workout['distancia_km'])
        
        return workouts[workout_type]
    
    def generate_weekly_plan(self, user_id, week_number):
        """Gera o plano de treino para a semana especificada"""
        user = User.query.get(user_id)
        if not user:
            return None
        
        # Determinar a fase de treinamento
        phase, volume_factor, intensity_factor, phase_desc = self.get_training_phase(
            week_number, user.semanas_treino
        )
        
        # Calcular volume base para a semana
        volume_base = 20 + (week_number * 3)
        volume_semanal = volume_base * volume_factor * user.performance_factor
        
        # Limitar volume máximo baseado no nível do usuário
        if user.nivel == 'iniciante':
            volume_semanal = min(volume_semanal, 35)
        elif user.nivel == 'intermediário':
            volume_semanal = min(volume_semanal, 50)
        else:  # avançado
            volume_semanal = min(volume_semanal, 70)
        
        # Calcular ritmos de treino
        user_data = user.to_dict()
        ritmos = self.calculate_training_paces(user_data)
        
        # Selecionar tipos de treino para a semana
        available_workouts = self.training_types[phase]
        selected_workouts = random.sample(
            available_workouts, 
            min(user.dias_semana, len(available_workouts))
        )
        
        # Garantir que sempre tenha um longo e um regenerativo
        if 'longo' not in selected_workouts:
            selected_workouts[0] = 'longo'
        if 'regenerativo' not in selected_workouts:
            selected_workouts[-1] = 'regenerativo'
        
        # Criar o plano de treino no banco de dados
        training_plan = TrainingPlan(
            user_id=user_id,
            semana=week_number,
            fase=phase,
            fase_desc=phase_desc,
            volume_total=volume_semanal
        )
        db.session.add(training_plan)
        db.session.flush()  # Para obter o ID
        
        # Gerar cada treino individualmente
        workouts = []
        for i, workout_type in enumerate(selected_workouts):
            treino = self.generate_workout(
                workout_type, week_number, phase, volume_semanal, 
                ritmos, user.performance_factor
            )
            
            workout = Workout(
                user_id=user_id,
                training_plan_id=training_plan.id,
                dia=i+1,
                tipo=treino['tipo'],
                distancia_km=round(treino['distancia_km'], 1),
                ritmo_alvo=treino['ritmo_alvo'],
                descricao=treino['descricao']
            )
            db.session.add(workout)
            workouts.append(workout)
        
        db.session.commit()
        
        return training_plan
    
    def update_performance_factor(self, user_id, feedback_data):
        """Atualiza o fator de performance baseado no feedback do usuário"""
        user = User.query.get(user_id)
        if not user:
            return None
        
        # Salvar feedback no banco
        feedback = UserFeedback(
            user_id=user_id,
            semana=feedback_data['semana'],
            consistencia=feedback_data['consistencia'],
            rpe_medio=feedback_data['rpe_medio'],
            fc_medio=feedback_data.get('fc_medio'),
            observacoes=feedback_data.get('observacoes')
        )
        db.session.add(feedback)
        
        # Análise de consistência (quantos treinos completados)
        consistencia = feedback_data['consistencia'] / user.dias_semana
        
        # Análise de esforço percebido (RPE)
        rpe_factor = 1.0
        if feedback_data['rpe_medio'] < 4:
            rpe_factor = 1.15  # Treinos muito fáceis - aumentar intensidade
        elif feedback_data['rpe_medio'] < 6:
            rpe_factor = 1.05  # Treinos fáceis - aumentar ligeiramente
        elif feedback_data['rpe_medio'] > 8:
            rpe_factor = 0.85  # Treinos muito difíceis - reduzir intensidade
        elif feedback_data['rpe_medio'] > 6:
            rpe_factor = 0.95  # Treinos difíceis - reduzir ligeiramente
            
        # Análise de FC (se disponível)
        fc_factor = 1.0
        if feedback_data.get('fc_medio'):
            fc_esperada = user.teste_5km_fc_media * 0.9  # FC esperada em treinos fáceis
            if feedback_data['fc_medio'] > fc_esperada * 1.15:
                fc_factor = 0.85  # FC muito alta - reduzir intensidade
            elif feedback_data['fc_medio'] > fc_esperada * 1.05:
                fc_factor = 0.95  # FC alta - reduzir ligeiramente
            elif feedback_data['fc_medio'] < fc_esperada * 0.85:
                fc_factor = 1.15  # FC muito baixa - aumentar intensidade
            elif feedback_data['fc_medio'] < fc_esperada * 0.95:
                fc_factor = 1.05  # FC baixa - aumentar ligeiramente
        
        # Novo fator de performance (média ponderada dos fatores)
        novo_fator = (consistencia * 0.3 + rpe_factor * 0.4 + fc_factor * 0.3) * user.performance_factor
        
        # Limitar ajustes para não mudanças muito bruscas
        user.performance_factor = max(0.7, min(1.3, novo_fator))
        
        db.session.commit()
        
        return user.performance_factor
    
    def analyze_medical_exams(self, user_id):
        """Analisa exames médicos para ajustar treinos"""
        # Buscar exames mais recentes de cada tipo
        bioimpedancia = UserExam.query.filter_by(
            user_id=user_id, 
            tipo_exame='bioimpedancia'
        ).order_by(UserExam.data_exame.desc()).first()
        
        espirometria = UserExam.query.filter_by(
            user_id=user_id, 
            tipo_exame='espirometria'
        ).order_by(UserExam.data_exame.desc()).first()
        
        vo2max = UserExam.query.filter_by(
            user_id=user_id, 
            tipo_exame='vo2max'
        ).order_by(UserExam.data_exame.desc()).first()
        
        adjustments = {
            'volume_factor': 1.0,
            'intensity_factor': 1.0,
            'recovery_factor': 1.0,
            'recommendations': []
        }
        
        # Análise de Bioimpedância
        if bioimpedancia:
            dados = json.loads(bioimpedancia.dados_exame) if isinstance(bioimpedancia.dados_exame, str) else bioimpedancia.dados_exame
            
            # Percentual de gordura - ajusta volume e recuperação
            perc_gordura = dados.get('percentual_gordura', 0)
            if perc_gordura > 25:  # Acima do ideal para corredores
                adjustments['volume_factor'] *= 0.9
                adjustments['recovery_factor'] *= 1.1
                adjustments['recommendations'].append(
                    "Alto % de gordura corporal. Reduzindo volume e aumentando recuperação."
                )
            elif perc_gordura < 10:  # Muito baixo - cuidado com overtraining
                adjustments['recovery_factor'] *= 1.15
                adjustments['recommendations'].append(
                    "Baixo % de gordura. Aumentando tempo de recuperação para prevenir lesões."
                )
            
            # Taxa Metabólica Basal - influencia capacidade de treino
            tmb = dados.get('taxa_metabolica_basal', 0)
            if tmb < 1500:
                adjustments['volume_factor'] *= 0.95
                adjustments['recommendations'].append(
                    "TMB baixa. Reduzindo volume de treino e focando em qualidade."
                )
        
        # Análise de Espirometria
        if espirometria:
            dados = json.loads(espirometria.dados_exame) if isinstance(espirometria.dados_exame, str) else espirometria.dados_exame
            
            # Relação VEF1/CVF - indica função pulmonar
            relacao = dados.get('relacao_vef1_cvf', 100)
            if relacao < 70:  # Possível obstrução
                adjustments['intensity_factor'] *= 0.85
                adjustments['recommendations'].append(
                    "Relação VEF1/CVF baixa. Reduzindo intensidade de treinos anaeróbicos."
                )
            elif relacao > 90:  # Excelente função pulmonar
                adjustments['intensity_factor'] *= 1.05
                adjustments['recommendations'].append(
                    "Excelente função pulmonar. Pode trabalhar com intensidades mais altas."
                )
        
        # Análise de VO2 Máx
        if vo2max:
            dados = json.loads(vo2max.dados_exame) if isinstance(vo2max.dados_exame, str) else vo2max.dados_exame
            
            vo2_value = dados.get('vo2max', 0)
            
            # Classificação VO2 máx (ml/kg/min)
            if vo2_value < 35:  # Baixo
                adjustments['volume_factor'] *= 0.9
                adjustments['intensity_factor'] *= 0.9
                adjustments['recommendations'].append(
                    f"VO2 máx baixo ({vo2_value:.1f}). Focando em base aeróbica antes de intensidade."
                )
            elif vo2_value > 55:  # Excelente
                adjustments['volume_factor'] *= 1.1
                adjustments['intensity_factor'] *= 1.1
                adjustments['recommendations'].append(
                    f"VO2 máx excelente ({vo2_value:.1f}). Aumentando volume e intensidade de treino."
                )
            
            # Usar limiares para zonas de treino precisas
            limiar_anaerobico = dados.get('limiar_anaerobico', 0)
            if limiar_anaerobico > 0:
                # Calcular % do VO2max para limiar
                limiar_percent = (limiar_anaerobico / vo2_value) * 100
                adjustments['limiar_percent'] = limiar_percent
                adjustments['recommendations'].append(
                    f"Limiar anaeróbico em {limiar_percent:.0f}% do VO2max. Ajustando zonas de treino."
                )
        
        return adjustments
    
    def apply_exam_adjustments(self, user_id, training_plan_data):
        """Aplica ajustes baseados em exames médicos ao plano de treino"""
        adjustments = self.analyze_medical_exams(user_id)
        
        # Ajustar volumes e intensidades
        if 'volume_semanal' in training_plan_data:
            training_plan_data['volume_semanal'] *= adjustments['volume_factor']
        
        if 'intensity_multiplier' in training_plan_data:
            training_plan_data['intensity_multiplier'] *= adjustments['intensity_factor']
        
        # Adicionar recomendações ao plano
        if adjustments['recommendations']:
            training_plan_data['medical_recommendations'] = adjustments['recommendations']
        
        return training_plan_data, adjustments
    
    def format_pace(self, pace_min_km):
        """Formata o ritmo no formato mm:ss"""
        minutes = int(pace_min_km)
        seconds = int((pace_min_km - minutes) * 60)
        return f"{minutes}:{seconds:02d}"


