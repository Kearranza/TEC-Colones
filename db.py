import sqlite3
from datetime import datetime

DATABASE = 'reciclaje.db'

def get_db_connection():
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        print(f"Error connecting to database: {e}")
        return None

def get_all_materials():
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM Materiales')
        materials = cursor.fetchall()
        conn.close()
        return materials
    return None

def get_material_by_id(material_id):
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM Materiales WHERE id = ?', (material_id,))
        material = cursor.fetchone()
        conn.close()
        return material
    return None

def insert_material(data):
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        try:
            cursor.execute('''
                INSERT INTO Materiales (id, nombre, unidad, valor_unitario, estado, fecha_creacion, descripcion)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                data['id'],
                data['nombre'],
                data['unidad'],
                data['valor_unitario'],
                data.get('estado', True),
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                data.get('descripcion', '')
            ))
            conn.commit()
            conn.close()
            return True
        except sqlite3.Error as e:
            print(f"Database insert error: {e}")
            return False
    return False