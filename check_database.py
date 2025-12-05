#!/usr/bin/env python3
"""
Verifica a estrutura do banco de dados
"""
import os
from dotenv import load_dotenv

load_dotenv()

from main import app, db
from sqlalchemy import text

def check_database():
    """Verifica se todas as colunas necessárias existem"""
    with app.app_context():
        try:
            db_url = str(db.engine.url)
            is_sqlite = 'sqlite' in db_url
            
            print(f"📊 Tipo de banco: {'SQLite' if is_sqlite else 'PostgreSQL'}")
            print(f"📍 URL: {db_url}")
            print()
            
            with db.engine.connect() as conn:
                if is_sqlite:
                    # Verificar tabela user_exams
                    print("🔍 Verificando estrutura da tabela user_exams...")
                    result = conn.execute(text("PRAGMA table_info(user_exams)"))
                    columns = result.fetchall()
                    
                    print("Colunas encontradas:")
                    for col in columns:
                        print(f"  - {col[1]} ({col[2]})")
                    
                    # Verificar se pdf_filename existe
                    column_names = [col[1] for col in columns]
                    if 'pdf_filename' in column_names:
                        print("\n✅ Coluna pdf_filename existe!")
                    else:
                        print("\n❌ Coluna pdf_filename NÃO existe!")
                        print("Execute: python migrate_add_pdf_filename.py")
                else:
                    # PostgreSQL
                    print("🔍 Verificando estrutura da tabela user_exams...")
                    result = conn.execute(text("""
                        SELECT column_name, data_type 
                        FROM information_schema.columns 
                        WHERE table_name='user_exams'
                        ORDER BY ordinal_position
                    """))
                    
                    columns = result.fetchall()
                    print("Colunas encontradas:")
                    for col in columns:
                        print(f"  - {col[0]} ({col[1]})")
                    
                    # Verificar se pdf_filename existe
                    column_names = [col[0] for col in columns]
                    if 'pdf_filename' in column_names:
                        print("\n✅ Coluna pdf_filename existe!")
                    else:
                        print("\n❌ Coluna pdf_filename NÃO existe!")
                        print("Execute: python migrate_add_pdf_filename.py")
                
                # Verificar outras tabelas
                print("\n📋 Listando todas as tabelas...")
                if is_sqlite:
                    result = conn.execute(text(
                        "SELECT name FROM sqlite_master WHERE type='table'"
                    ))
                else:
                    result = conn.execute(text(
                        "SELECT tablename FROM pg_tables WHERE schemaname='public'"
                    ))
                
                tables = result.fetchall()
                for table in tables:
                    print(f"  - {table[0]}")
                    
        except Exception as e:
            print(f"❌ Erro: {e}")
            import traceback
            traceback.print_exc()

if __name__ == '__main__':
    check_database()
