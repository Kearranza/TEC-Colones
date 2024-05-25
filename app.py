from flask import Flask
from materials import materials
from sedes import sedes
from centros import centros
from cambios import cambios  
from config import Config

app = Flask(__name__)
CORS(app)

app.config.from_object(Config)

# Registro de Blueprints
app.register_blueprint(materials)
app.register_blueprint(sedes)
app.register_blueprint(centros)
app.register_blueprint(cambios)  

if __name__ == '__main__':
    app.run(debug=app.config['DEBUG'], use_reloader=False)
