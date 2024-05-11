from flask import Flask
from materials import materials
from config import Config
from sedes import sedes
from centros import centros
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

app.config.from_object(Config)
app.register_blueprint(materials)
app.register_blueprint(sedes)
app.register_blueprint(centros)
if __name__ == '__main__':
    app.run(debug=app.config['DEBUG'], use_reloader=False)
