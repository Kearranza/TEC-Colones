from flask import Flask
from flask_cors import CORS
from EndPoints.materials import materials
from EndPoints.sedes import sedes
from EndPoints.centros import centros
from EndPoints.cambios import cambios  
from Variados.config import Config
from usuarios import usuarios

app = Flask(__name__)
CORS(app)

app.config.from_object(Config)

# Registro de Blueprints
app.register_blueprint(materials)
app.register_blueprint(sedes)
app.register_blueprint(centros)
app.register_blueprint(cambios)  
app.register_blueprint(usuarios)

if __name__ == '__main__':
    app.run(debug=app.config['DEBUG'], use_reloader=False)
