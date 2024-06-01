from flask import Blueprint, request, jsonify
from EndPoints.db import get_all_materials, get_material_by_id, insert_material
from Variados.utils import generate_id
from datetime import datetime
from flask import Blueprint

materials = Blueprint('materials', __name__)


@materials.route('/materiales', methods=['GET'])
def get_materials():
    materials = get_all_materials()
    if materials is None:
        return jsonify({"error": "Database connection failed"}), 500
    return jsonify([dict(material) for material in materials]), 200

@materials.route('/materiales/<string:id>', methods=['GET'])
def get_material(id):
    material = get_material_by_id(id)
    if material is None:
        return jsonify({"error": "Material not found"}), 404
    return jsonify(dict(material)), 200

@materials.route('/materiales', methods=['POST'])
def create_material():
    data = request.get_json()
    if not data or not all(k in data for k in ['nombre', 'unidad', 'valor_unitario']):
        return jsonify({"error": "Missing data, required fields: nombre, unidad, valor_unitario"}), 400
    
    data['id'] = generate_id()
    data['fecha_creacion'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    success = insert_material(data)
    if not success:
        return jsonify({"error": "An error occurred while trying to create material"}), 500

    return jsonify({"id": data['id']}), 201

