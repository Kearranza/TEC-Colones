from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime
import random
import string

app = Flask(__name__)
CORS(app)

DATABASE = 'reciclaje.db'

def get_db_connection():
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row  # Permite acceder a las columnas por nombre
        return conn
    except sqlite3.Error as e:
        print(f"Error connecting to database: {e}")
        return None

def generate_id():
    """ Generate a unique 'M-' prefixed 12-character alphanumeric ID """
    return 'M-' + ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(12))

@app.route('/materiales', methods=['GET'])
def get_materials():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    materials = conn.execute('SELECT * FROM Materiales').fetchall()
    conn.close()

    return jsonify([dict(material) for material in materials]), 200

@app.route('/materiales/<string:id>', methods=['GET'])
def get_material(id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    material = conn.execute('SELECT * FROM Materiales WHERE id = ?', (id,)).fetchone()
    conn.close()
    
    if material is None:
        return jsonify({"error": "Material not found"}), 404
    
    return jsonify(dict(material)), 200

@app.route('/materiales', methods=['POST'])
def create_material():
    data = request.get_json()
    if not data or not all(k in data for k in ['nombre', 'unidad', 'valor_unitario']):
        return jsonify({"error": "Missing data, required fields: nombre, unidad, valor_unitario"}), 400
    
    id = generate_id()
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        
        cursor = conn.cursor()
        cursor.execute('''INSERT INTO Materiales (id, nombre, unidad, valor_unitario, estado, fecha_creacion, descripcion)
                          VALUES (?, ?, ?, ?, ?, ?, ?)''',
                       (id, data['nombre'], data['unidad'], data['valor_unitario'], data.get('estado', True),
                        datetime.now().strftime("%Y-%m-%d %H:%M:%S"), data.get('descripcion', '')))
        conn.commit()
        conn.close()
    except sqlite3.Error as e:
        return jsonify({"error": f"An error occurred: {e}"}), 500
    
    return jsonify({"id": id}), 201

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
