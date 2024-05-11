from flask import Blueprint, request, jsonify
from db import get_all_sedes, get_sede_by_id, insert_sede
from utils import generate_id
from datetime import datetime
from db import get_all_sedes

sedes = Blueprint('sedes', __name__)

@sedes.route('/sedes', methods=['GET'])
def get_sedes():
    """Endpoint to retrieve all sedes from the database"""
    sedes = get_all_sedes()
    if not sedes:
        return jsonify({"error": "Database connection failed or no sedes found"}), 500
    return jsonify([dict(sede) for sede in sedes]), 200

@sedes.route('/sedes/<string:id>', methods=['GET'])
def get_sede(id):
    """Endpoint to retrieve a single sede by its ID"""
    sede = get_sede_by_id(id)
    if not sede:
        return jsonify({"error": "Sede not found"}), 404
    return jsonify(dict(sede)), 200

@sedes.route('/sedes', methods=['POST'])
def create_sede():
    """Endpoint to create a new sede after validating required fields."""
    data = request.get_json()
    if not data or not all(k in data for k in ['nombre', 'ubicacion', 'estado', 'numero_contacto', 'activa']):
        return jsonify({"error": "Missing data, required fields: nombre, ubicacion, estado, numero_contacto, activa"}), 400
    
    # Generate a unique ID for the new sede
    data['id'] = generate_id('S-')
    # Record the creation date
    data['fecha_creacion'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Attempt to insert the new sede into the database
    if not insert_sede(data):
        return jsonify({"error": "An error occurred while trying to create sede"}), 500

    return jsonify({"id": data['id']}), 201

