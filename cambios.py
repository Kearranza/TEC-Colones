from flask import Blueprint, request, jsonify
from db import get_all_cambios, get_cambio_by_id, insert_cambio
from utils import generate_id

cambios = Blueprint('cambios', __name__)

@cambios.route('/cambios', methods=['GET'])
def get_cambios():
    """Endpoint to retrieve all cambios."""
    cambios_list = get_all_cambios()
    if cambios_list:
        return jsonify([dict(cambio) for cambio in cambios_list]), 200
    return jsonify({"error": "No hay datos en la tabla cambios"}), 404

@cambios.route('/cambios/<string:id>', methods=['GET'])
def get_cambio(id):
    """Endpoint to retrieve a single cambio by its ID."""
    cambio = get_cambio_by_id(id)
    if cambio:
        return jsonify(dict(cambio)), 200
    return jsonify({"error": "No hay datos en la tabla cambios"}), 404

@cambios.route('/cambios', methods=['POST'])
def create_cambio():
    """Endpoint to create a new cambio."""
    data = request.get_json()
    required_fields = ['codigo_centro_acopio', 'estudiante', 'monto']
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing data, required fields: codigo_centro_acopio, estudiante, monto'}), 400
    
    data['id'] = generate_id('R-')
    success = insert_cambio(data)
    if success:
        # Devuelve el ID del cambio si se creó correctamente
        return jsonify({'id': data['id']}), 201
    else:
        # Devuelve un mensaje de error si el cambio no se pudo generar
        return jsonify({"error": "No se generó el cambio de material"}), 500