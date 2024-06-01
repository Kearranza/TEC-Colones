from flask import Blueprint, request, jsonify
from EndPoints.db import get_all_centros, get_centro_by_codigo, insert_centro, get_sede_by_id
from Variados.utils import generate_id
from datetime import datetime

centros = Blueprint('centros', __name__)

@centros.route('/centros', methods=['GET'])
def get_centros():
    """Endpoint to retrieve all centros de acopio from the database"""
    centros = get_all_centros()
    if not centros:
        return jsonify({"error": "Database connection failed or no centros found"}), 500
    return jsonify([dict(centro) for centro in centros]), 200

@centros.route('/centros/<string:codigo>', methods=['GET'])
def get_centro(codigo):
    """Endpoint to retrieve a single centro de acopio by its codigo"""
    centro = get_centro_by_codigo(codigo)
    if not centro:
        return jsonify({"error": "Centro not found"}), 404
    return jsonify(dict(centro)), 200

@centros.route('/centros', methods=['POST'])
def create_centro():
    """Endpoint to create a new centro de acopio after validating required fields."""
    data = request.get_json()
    if not data or not all(k in data for k in ['codigo', 'ubicacion', 'estado', 'numero_contacto', 'id_sede', 'usuario_creador']):
        return jsonify({"error": "Missing data, required fields: codigo, ubicacion, estado, numero_contacto, id_sede, usuario_creador"}), 400
    
    # Check if the provided 'id_sede' exists in the database
    if not get_sede_by_id(data['id_sede']):
        return jsonify({"error": "Sede not found"}), 404

    # Record the creation date
    data['fecha_creacion'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Attempt to insert the new centro into the database
    if not insert_centro(data):
        return jsonify({"error": "An error occurred while trying to create centro"}), 500

    return jsonify({"codigo": data['codigo']}), 201

