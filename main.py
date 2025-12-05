import os
import sys
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.routes.training import training_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

# Configurações da aplicação
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

# Garantir que o diretório do banco de dados existe
# Usar caminho absoluto para evitar problemas
base_dir = os.path.abspath(os.path.dirname(__file__))
db_dir = os.path.join(base_dir, 'database')
os.makedirs(db_dir, exist_ok=True)

# URL do banco de dados (SQLite precisa de 4 barras: sqlite:/// + caminho absoluto)
db_path = os.path.join(db_dir, 'app.db')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', f"sqlite:///{db_path}")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Habilitar CORS para permitir requisições do frontend
CORS(app, origins=[os.getenv('FRONTEND_URL', 'http://localhost:5173')])

# Registrar blueprints
app.register_blueprint(training_bp, url_prefix='/api')

# Inicializar banco de dados
db.init_app(app)

def run_migrations():
    """Executa migrações necessárias no banco de dados"""
    with app.app_context():
        try:
            from sqlalchemy import text
            
            # Detectar tipo de banco
            db_url = str(db.engine.url)
            is_sqlite = 'sqlite' in db_url
            
            with db.engine.connect() as conn:
                # Verificar se coluna pdf_filename existe
                if is_sqlite:
                    result = conn.execute(text("PRAGMA table_info(user_exams)"))
                    columns = [row[1] for row in result.fetchall()]
                    column_exists = 'pdf_filename' in columns
                else:
                    # PostgreSQL
                    result = conn.execute(text("""
                        SELECT column_name 
                        FROM information_schema.columns 
                        WHERE table_name='user_exams' 
                        AND column_name='pdf_filename'
                    """))
                    column_exists = result.fetchone() is not None
                
                if not column_exists:
                    print("📊 Adicionando coluna pdf_filename...")
                    conn.execute(text("""
                        ALTER TABLE user_exams 
                        ADD COLUMN pdf_filename VARCHAR(255)
                    """))
                    conn.commit()
                    print("✅ Migração concluída!")
        except Exception as e:
            # Se der erro (ex: tabela não existe), criar todas as tabelas
            print(f"⚠️  Criando/atualizando tabelas: {e}")
            db.create_all()

# Hook para criar banco de dados na primeira requisição
@app.before_request
def create_tables():
    try:
        db.create_all()
        run_migrations()
    except Exception:
        pass  # Tabelas já existem

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """Serve frontend static files"""
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

@app.route('/health')
def health_check():
    """Health check endpoint for monitoring"""
    return {'status': 'healthy', 'service': 'FitIA API'}, 200

if __name__ == '__main__':
    # Criar tabelas do banco de dados
    try:
        with app.app_context():
            db.create_all()
            print("✅ Banco de dados inicializado!")
    except Exception as e:
        print(f"⚠️  Aviso: Erro ao criar banco de dados: {e}")
        print("O banco será criado automaticamente na primeira requisição.")
    
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'
    print(f"🚀 Iniciando servidor na porta {port}...")
    app.run(host='0.0.0.0', port=port, debug=debug)
