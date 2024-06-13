from flask import Blueprint, request, jsonify
from EndPoints.db import get_all_usuarios, get_usuario_by_username, insert_usuario, get_centro_by_codigo, get_usuarios_by_permiso
from datetime import datetime

usuarios = Blueprint('usuarios', __name__)

@usuarios.route('/usuarios', methods=['GET'])
def get_usuarios():
    """Endpoint to retrieve all users from the database"""
    usuarios = get_all_usuarios()
    if not usuarios:
        return jsonify({"error": "Database connection failed or no users found"}), 500
    return jsonify([dict(usuario) for usuario in usuarios]), 200

@usuarios.route('/usuarios/<string:username>', methods=['GET'])
def get_usuario(username):
    """Endpoint to retrieve a single user by their username"""
    usuario = get_usuario_by_username(username)
    if not usuario:
        return jsonify({"error": "User not found"}), 404
    return jsonify(dict(usuario)), 200

@usuarios.route('/usuarios', methods=['POST'])
def create_usuario():
    """Endpoint to create a new user after validating required fields."""
    data = request.get_json()
    if not data or not all(k in data for k in ['Usuario', 'Contraseña', 'Permisos']):
        return jsonify({"error": "Missing data, required fields: Usuario, Contraseña, Permisos"}), 400
    
    # Optionally check for the presence of 'Codigo_Centro_Acopio' and validate it
    if 'Codigo_Centro_Acopio' in data and data['Codigo_Centro_Acopio'] and not get_centro_by_codigo(data['Codigo_Centro_Acopio']):
        return jsonify({"error": "Centro de Acopio not found"}), 404

    # Attempt to insert the new user into the database
    if not insert_usuario(data):
        return jsonify({"error": "An error occurred while trying to create user"}), 500

    return jsonify({"Usuario": data['Usuario']}), 201
@usuarios.route('/usuarios/permisos/<string:permiso>', methods=['GET'])
def get_usuarios_by_permiso_route(permiso):
    """Endpoint to retrieve users by their permission type"""
    usuarios = get_usuarios_by_permiso(permiso)
    if not usuarios:
        return jsonify({"error": "No users found with the specified permission"}), 404
    return jsonify([dict(usuario) for usuario in usuarios]), 200
