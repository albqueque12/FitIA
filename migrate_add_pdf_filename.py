#!/usr/bin/env python3
"""
Migração: Adiciona coluna pdf_filename à tabela user_exams
"""
import os
import sys
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

from main import app, db
from sqlalchemy import text

def migrate():
    """Adiciona coluna pdf_filename se não existir"""
    with app.app_context():
        try:
            # Detectar tipo de banco de dados
            db_url = str(db.engine.url)
            is_sqlite = 'sqlite' in db_url
            
            with db.engine.connect() as conn:
                if is_sqlite:
                    # SQLite: verificar se coluna existe usando PRAGMA
                    result = conn.execute(text("PRAGMA table_info(user_exams)"))
                    columns = [row[1] for row in result.fetchall()]
                    
                    if 'pdf_filename' not in columns:
                        print("Adicionando coluna pdf_filename no SQLite...")
                        conn.execute(text("""
                            ALTER TABLE user_exams 
                            ADD COLUMN pdf_filename VARCHAR(255)
                        """))
                        conn.commit()
                        print("✅ Coluna pdf_filename adicionada com sucesso!")
                    else:
                        print("ℹ️  Coluna pdf_filename já existe")
                else:
                    # PostgreSQL: usar information_schema
                    result = conn.execute(text("""
                        SELECT column_name 
                        FROM information_schema.columns 
                        WHERE table_name='user_exams' 
                        AND column_name='pdf_filename'
                    """))
                    
                    if result.fetchone() is None:
                        print("Adicionando coluna pdf_filename no PostgreSQL...")
                        conn.execute(text("""
                            ALTER TABLE user_exams 
                            ADD COLUMN pdf_filename VARCHAR(255)
                        """))
                        conn.commit()
                        print("✅ Coluna pdf_filename adicionada com sucesso!")
                    else:
                        print("ℹ️  Coluna pdf_filename já existe")
                    
        except Exception as e:
            print(f"⚠️  Erro ao adicionar coluna: {e}")
            print("Tentando criar/atualizar todas as tabelas...")
            
            # Se der erro, recriar a tabela
            db.create_all()
            print("✅ Tabelas criadas/atualizadas!")

if __name__ == '__main__':
    migrate()
