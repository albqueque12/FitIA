"""
Script de migração para adicionar colunas teste_3km
Executa uma vez para atualizar o banco de dados
"""
import os
import sys
from dotenv import load_dotenv

load_dotenv()

from main import app
from src.models.user import db

def migrate():
    with app.app_context():
        # Conectar ao banco
        inspector = db.inspect(db.engine)
        columns = [col['name'] for col in inspector.get_columns('users')]
        
        print("Colunas atuais:", columns)
        
        # Adicionar colunas teste_3km se não existirem
        if 'teste_3km_tempo' not in columns:
            print("Adicionando colunas teste_3km...")
            with db.engine.connect() as conn:
                conn.execute(db.text('ALTER TABLE users ADD COLUMN teste_3km_tempo FLOAT'))
                conn.execute(db.text('ALTER TABLE users ADD COLUMN teste_3km_fc_media FLOAT'))
                conn.execute(db.text('ALTER TABLE users ADD COLUMN teste_3km_rpe INTEGER'))
                conn.commit()
            print("✓ Colunas teste_3km adicionadas com sucesso!")
        else:
            print("✓ Colunas teste_3km já existem")
        
        # Tornar colunas teste_5km nullable
        print("Atualizando colunas teste_5km para nullable...")
        # SQLite não suporta ALTER COLUMN, então vamos apenas documentar
        print("⚠ SQLite não suporta ALTER COLUMN. Para PostgreSQL será feito automaticamente.")
        
        print("\n✓ Migração concluída!")

if __name__ == '__main__':
    migrate()
