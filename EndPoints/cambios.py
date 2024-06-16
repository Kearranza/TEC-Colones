from flask import Blueprint, request, jsonify
from EndPoints.db import get_all_cambios, get_cambio_by_id, insert_cambio, update_cambio
from Variados.utils import generate_id
from datetime import datetime

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
def create_or_update_cambio():
    """Endpoint to create or update a cambio."""
    data = request.get_json()
    required_fields = ['codigo_centro_acopio', 'estudiante', 'monto', 'id_material', 'cantidad', 'estado']
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing data, required fields: codigo_centro_acopio, estudiante, monto, id_material, cantidad, estado'}), 400

    if data['estado'] not in [0, 1, 3]:
        return jsonify({'error': 'Invalid state value'}), 400

    cambio_id = data.get('id')
    if cambio_id:
        existing_cambio = get_cambio_by_id(cambio_id)
        if existing_cambio:
            # Actualizar el cambio existente
            success, message = update_cambio(cambio_id, data)
        else:
            return jsonify({"error": "Cambio ID not found for update"}), 404
    else:
        # Crear un nuevo cambio
        data['id'] = generate_id('R-')
        data['fecha_transaccion'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        success, message = insert_cambio(data)

    if success:
        return jsonify({'id': data['id'], 'message': message}), 201 if not cambio_id else 200
    else:
        return jsonify({"error": message}), 500
