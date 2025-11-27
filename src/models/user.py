from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    idade = db.Column(db.Integer, nullable=False)
    peso = db.Column(db.Float, nullable=False)
    sexo = db.Column(db.String(1), nullable=False)
    nivel = db.Column(db.String(20), nullable=False)
    distancia_objetivo = db.Column(db.Float, nullable=False)
    tempo_objetivo_min = db.Column(db.Integer, nullable=False)
    semanas_treino = db.Column(db.Integer, nullable=False)
    dias_semana = db.Column(db.Integer, nullable=False)
    teste_5km_tempo = db.Column(db.Float, nullable=False)
    teste_5km_fc_media = db.Column(db.Float, nullable=False)
    teste_5km_rpe = db.Column(db.Integer, nullable=False)
    performance_factor = db.Column(db.Float, default=1.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    training_plans = db.relationship('TrainingPlan', backref='user', lazy=True)
    workouts = db.relationship('Workout', backref='user', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'idade': self.idade,
            'peso': self.peso,
            'sexo': self.sexo,
            'nivel': self.nivel,
            'distancia_objetivo': self.distancia_objetivo,
            'tempo_objetivo_min': self.tempo_objetivo_min,
            'semanas_treino': self.semanas_treino,
            'dias_semana': self.dias_semana,
            'teste_5km_tempo': self.teste_5km_tempo,
            'teste_5km_fc_media': self.teste_5km_fc_media,
            'teste_5km_rpe': self.teste_5km_rpe,
            'performance_factor': self.performance_factor,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class TrainingPlan(db.Model):
    __tablename__ = 'training_plans'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    semana = db.Column(db.Integer, nullable=False)
    fase = db.Column(db.String(20), nullable=False)
    fase_desc = db.Column(db.String(200), nullable=False)
    volume_total = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    workouts = db.relationship('Workout', backref='training_plan', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'semana': self.semana,
            'fase': self.fase,
            'fase_desc': self.fase_desc,
            'volume_total': self.volume_total,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'workouts': [workout.to_dict() for workout in self.workouts]
        }

class Workout(db.Model):
    __tablename__ = 'workouts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    training_plan_id = db.Column(db.Integer, db.ForeignKey('training_plans.id'), nullable=True)
    dia = db.Column(db.Integer, nullable=False)
    tipo = db.Column(db.String(20), nullable=False)
    distancia_km = db.Column(db.Float, nullable=False)
    ritmo_alvo = db.Column(db.Float, nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    completed = db.Column(db.Boolean, default=False)
    rpe_realizado = db.Column(db.Integer, nullable=True)
    fc_media = db.Column(db.Float, nullable=True)
    tempo_realizado = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'training_plan_id': self.training_plan_id,
            'dia': self.dia,
            'tipo': self.tipo,
            'distancia_km': self.distancia_km,
            'ritmo_alvo': self.ritmo_alvo,
            'ritmo_formatado': self.format_pace(self.ritmo_alvo),
            'descricao': self.descricao,
            'completed': self.completed,
            'rpe_realizado': self.rpe_realizado,
            'fc_media': self.fc_media,
            'tempo_realizado': self.tempo_realizado,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }
    
    def format_pace(self, pace_min_km):
        """Formata o ritmo no formato mm:ss"""
        minutes = int(pace_min_km)
        seconds = int((pace_min_km - minutes) * 60)
        return f"{minutes}:{seconds:02d}"

class UserFeedback(db.Model):
    __tablename__ = 'user_feedback'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    semana = db.Column(db.Integer, nullable=False)
    consistencia = db.Column(db.Integer, nullable=False)  # quantos treinos completou
    rpe_medio = db.Column(db.Float, nullable=False)
    fc_medio = db.Column(db.Float, nullable=True)
    observacoes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'semana': self.semana,
            'consistencia': self.consistencia,
            'rpe_medio': self.rpe_medio,
            'fc_medio': self.fc_medio,
            'observacoes': self.observacoes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

# Modelo para futuras funcionalidades de exames
class UserExam(db.Model):
    __tablename__ = 'user_exams'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    tipo_exame = db.Column(db.String(50), nullable=False)  # 'bioimpedancia', 'espirometria', 'vo2max'
    dados_exame = db.Column(db.Text, nullable=True)  # JSON com os dados do exame (opcional se tiver PDF)
    pdf_filename = db.Column(db.String(255), nullable=True)  # Nome do arquivo PDF armazenado
    data_exame = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'tipo_exame': self.tipo_exame,
            'dados_exame': json.loads(self.dados_exame) if self.dados_exame else {},
            'pdf_filename': self.pdf_filename,
            'data_exame': self.data_exame.isoformat() if self.data_exame else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

