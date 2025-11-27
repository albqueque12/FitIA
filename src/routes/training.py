from flask import Blueprint, request, jsonify
from src.models.user import User, TrainingPlan, Workout, UserFeedback, UserExam, db
from src.services.training_ai import TrainingAIService
from datetime import datetime
import json

training_bp = Blueprint('training', __name__)
ai_service = TrainingAIService()

@training_bp.route('/users', methods=['POST'])
def create_user():
    """Cria um novo usuário com dados iniciais"""
    try:
        data = request.get_json()
        
        # Validar dados obrigatórios
        required_fields = [
            'idade', 'peso', 'sexo', 'nivel', 'distancia_objetivo',
            'tempo_objetivo_min', 'semanas_treino', 'dias_semana',
            'teste_5km_tempo', 'teste_5km_fc_media', 'teste_5km_rpe'
        ]
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo obrigatório: {field}'}), 400
        
        # Criar usuário
        user = User(
            idade=data['idade'],
            peso=data['peso'],
            sexo=data['sexo'].upper(),
            nivel=data['nivel'].lower(),
            distancia_objetivo=data['distancia_objetivo'],
            tempo_objetivo_min=data['tempo_objetivo_min'],
            semanas_treino=data['semanas_treino'],
            dias_semana=data['dias_semana'],
            teste_5km_tempo=data['teste_5km_tempo'],
            teste_5km_fc_media=data['teste_5km_fc_media'],
            teste_5km_rpe=data['teste_5km_rpe']
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Calcular ritmos de treino
        user_data = user.to_dict()
        ritmos = ai_service.calculate_training_paces(user_data)
        
        return jsonify({
            'user': user.to_dict(),
            'ritmos': ritmos,
            'message': 'Usuário criado com sucesso!'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@training_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Obtém dados do usuário"""
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@training_bp.route('/users/<int:user_id>/training-plan/<int:week_number>', methods=['POST'])
def generate_training_plan(user_id, week_number):
    """Gera plano de treino para uma semana específica"""
    try:
        user = User.query.get_or_404(user_id)
        
        # Verificar se já existe plano para esta semana
        existing_plan = TrainingPlan.query.filter_by(
            user_id=user_id, 
            semana=week_number
        ).first()
        
        if existing_plan:
            return jsonify({
                'training_plan': existing_plan.to_dict(),
                'message': 'Plano já existe para esta semana'
            })
        
        # Analisar exames médicos antes de gerar o plano
        exam_adjustments = ai_service.analyze_medical_exams(user_id)
        
        # Gerar novo plano
        training_plan = ai_service.generate_weekly_plan(user_id, week_number)
        
        if not training_plan:
            return jsonify({'error': 'Erro ao gerar plano de treino'}), 500
        
        return jsonify({
            'training_plan': training_plan.to_dict(),
            'exam_adjustments': exam_adjustments,
            'message': 'Plano de treino gerado com sucesso!'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@training_bp.route('/users/<int:user_id>/training-plans', methods=['GET'])
def get_user_training_plans(user_id):
    """Obtém todos os planos de treino do usuário"""
    user = User.query.get_or_404(user_id)
    plans = TrainingPlan.query.filter_by(user_id=user_id).order_by(TrainingPlan.semana).all()
    
    return jsonify({
        'user': user.to_dict(),
        'training_plans': [plan.to_dict() for plan in plans]
    })

@training_bp.route('/workouts/<int:workout_id>/complete', methods=['POST'])
def complete_workout(workout_id):
    """Marca um treino como completo e registra dados de performance"""
    try:
        data = request.get_json()
        workout = Workout.query.get_or_404(workout_id)
        
        workout.completed = True
        workout.completed_at = datetime.utcnow()
        
        if 'rpe_realizado' in data:
            workout.rpe_realizado = data['rpe_realizado']
        if 'fc_media' in data:
            workout.fc_media = data['fc_media']
        if 'tempo_realizado' in data:
            workout.tempo_realizado = data['tempo_realizado']
        
        db.session.commit()
        
        return jsonify({
            'workout': workout.to_dict(),
            'message': 'Treino marcado como completo!'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@training_bp.route('/users/<int:user_id>/feedback', methods=['POST'])
def submit_feedback(user_id):
    """Submete feedback semanal e atualiza fator de performance"""
    try:
        data = request.get_json()
        
        # Validar dados obrigatórios
        required_fields = ['semana', 'consistencia', 'rpe_medio']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo obrigatório: {field}'}), 400
        
        # Atualizar fator de performance
        new_performance_factor = ai_service.update_performance_factor(user_id, data)
        
        if new_performance_factor is None:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        return jsonify({
            'new_performance_factor': new_performance_factor,
            'message': 'Feedback registrado e performance atualizada!'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@training_bp.route('/users/<int:user_id>/feedback', methods=['GET'])
def get_user_feedbacks(user_id):
    """Retorna histórico de feedbacks do usuário"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        feedbacks = UserFeedback.query.filter_by(user_id=user_id).order_by(UserFeedback.semana.asc()).all()
        
        return jsonify({
            'feedbacks': [f.to_dict() for f in feedbacks],
            'total': len(feedbacks),
            'current_performance_factor': user.performance_factor
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@training_bp.route('/users/<int:user_id>/exams', methods=['POST'])
def add_user_exam(user_id):
    """Adiciona exame do usuário (funcionalidade futura)"""
    try:
        data = request.get_json()
        
        required_fields = ['tipo_exame', 'dados_exame', 'data_exame']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo obrigatório: {field}'}), 400
        
        exam = UserExam(
            user_id=user_id,
            tipo_exame=data['tipo_exame'],
            dados_exame=json.dumps(data['dados_exame']),
            data_exame=datetime.fromisoformat(data['data_exame'])
        )
        
        db.session.add(exam)
        db.session.commit()
        
        return jsonify({
            'exam': exam.to_dict(),
            'message': 'Exame adicionado com sucesso!'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@training_bp.route('/users/<int:user_id>/exams', methods=['GET'])
def get_user_exams(user_id):
    """Obtém todos os exames do usuário"""
    user = User.query.get_or_404(user_id)
    exams = UserExam.query.filter_by(user_id=user_id).order_by(UserExam.data_exame.desc()).all()
    
    return jsonify({
        'user_id': user_id,
        'exams': [exam.to_dict() for exam in exams]
    })

@training_bp.route('/users/<int:user_id>/progress', methods=['GET'])
def get_user_progress(user_id):
    """Obtém progresso geral do usuário"""
    user = User.query.get_or_404(user_id)
    
    # Estatísticas gerais
    total_plans = TrainingPlan.query.filter_by(user_id=user_id).count()
    total_workouts = Workout.query.filter_by(user_id=user_id).count()
    completed_workouts = Workout.query.filter_by(user_id=user_id, completed=True).count()
    
    # Feedback recente
    recent_feedback = UserFeedback.query.filter_by(user_id=user_id)\
        .order_by(UserFeedback.created_at.desc()).limit(5).all()
    
    # Progresso em relação ao objetivo
    progress_percentage = (total_plans / user.semanas_treino) * 100 if user.semanas_treino > 0 else 0
    
    return jsonify({
        'user': user.to_dict(),
        'statistics': {
            'total_plans': total_plans,
            'total_workouts': total_workouts,
            'completed_workouts': completed_workouts,
            'completion_rate': (completed_workouts / total_workouts * 100) if total_workouts > 0 else 0,
            'progress_percentage': min(100, progress_percentage)
        },
        'recent_feedback': [feedback.to_dict() for feedback in recent_feedback]
    })

