import numpy as np
import pandas as pd
import random
from datetime import datetime, timedelta
from src.models.user import User, TrainingPlan, Workout, UserFeedback, db

class TrainingAIService:
    def __init__(self):
        self.training_types = {
            'base': ['fácil', 'longo', 'progressivo', 'fartlek', 'regenerativo'],
            'construção': ['fácil', 'longo', 'tempo', 'intervalo', 'progressivo', 'regenerativo'],
            'intensificação': ['fácil', 'longo', 'tempo', 'intervalo', 'ritmo', 'regenerativo'],
            'tapering': ['fácil', 'longo', 'tempo', 'regenerativo', 'fartlek']
        }
    
    def calculate_training_paces(self, user_data):
        """Calcula os ritmos de treino baseado no teste de 3km ou 5km e objetivo"""
        # Priorizar teste de 3km, se não tiver usar 5km
        if user_data.get('teste_3km_tempo'):
            tempo_teste = user_data['teste_3km_tempo']
            distancia_teste = 3
        else:
            tempo_teste = user_data['teste_5km_tempo']
            distancia_teste = 5
        
        ritmo_teste = tempo_teste / distancia_teste  # min/km
        ritmo_objetivo = user_data['tempo_objetivo_min'] / user_data['distancia_objetivo']
        
        # Fórmula adaptativa baseada no objetivo
        diff_factor = ritmo_objetivo / ritmo_teste
        
        # Ajustar fatores com base na diferença entre atual e objetivo
        if diff_factor > 1.2:
            # Objetivo muito mais lento que atual - iniciante
            ritmo_facil = ritmo_teste * 1.15
            ritmo_longo = ritmo_teste * 1.1
            ritmo_tempo = ritmo_teste * 0.95
            ritmo_intervalo = ritmo_teste * 0.85
            ritmo_limiar = ritmo_teste * 0.9
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
            ritmo_facil = ritmo_teste * 1.2
            ritmo_longo = ritmo_teste * 1.15
            ritmo_tempo = ritmo_teste * 0.95
            ritmo_intervalo = ritmo_teste * 0.85
            ritmo_limiar = ritmo_teste * 0.9
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
    
    def format_pace(self, pace_min_km):
        """Formata o ritmo no formato mm:ss"""
        minutes = int(pace_min_km)
        seconds = int((pace_min_km - minutes) * 60)
        return f"{minutes}:{seconds:02d}"

