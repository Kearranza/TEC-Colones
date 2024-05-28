import sqlite3
from datetime import datetime

DATABASE = 'reciclaje.db'

def get_db_connection():
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row  # Permite acceder a las columnas por nombre
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

def get_all_sedes():
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM Sedes')
        sedes = cursor.fetchall()
        conn.close()
        return sedes
    return None

def get_sede_by_id(sede_id):
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM Sedes WHERE id = ?', (sede_id,))
        sede = cursor.fetchone()
        conn.close()
        return sede
    return None

def insert_sede(data):
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        try:
            cursor.execute('''
                INSERT INTO Sedes (id, nombre, ubicacion, estado, numero_contacto)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                data['id'],
                data['nombre'],
                data['ubicacion'],
                data['estado'],
                data['numero_contacto']
            ))
            conn.commit()
            conn.close()
            return True
        except sqlite3.Error as e:
            print(f"Database insert error: {e}")
            return False
    return False
# Funciones para centros de acopio
def get_all_centros():
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM CentrosDeAcopio')
        centros = cursor.fetchall()
        conn.close()
        return centros
    return None

def get_centro_by_codigo(codigo):
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM CentrosDeAcopio WHERE codigo = ?', (codigo,))
        centro = cursor.fetchone()
        conn.close()
        return centro
    return None

def insert_centro(data):
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        try:
            cursor.execute('''
                INSERT INTO CentrosDeAcopio (codigo, ubicacion, estado, numero_contacto, id_sede, usuario_creador, fecha_creacion)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                data['codigo'],
                data['ubicacion'],
                data['estado'],
                data['numero_contacto'],
                data['id_sede'],
                data['usuario_creador'],
                datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            ))
            conn.commit()
            conn.close()
            return True
        except sqlite3.Error as e:
            print(f"Database insert error: {e}")
            return False
    return False

def get_all_cambios():
    """Retrieve all records from the Cambios table."""
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Cambios")
        cambios = cursor.fetchall()
        conn.close()
        return cambios
    return None

def get_cambio_by_id(cambio_id):
    """Retrieve a specific cambio by ID."""
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Cambios WHERE id = ?", (cambio_id,))
        cambio = cursor.fetchone()
        conn.close()
        return cambio
    return None

def insert_cambio(data):
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()

        # Verifica si el centro de acopio existe
        cursor.execute("SELECT * FROM CentrosDeAcopio WHERE codigo = ?", (data['codigo_centro_acopio'],))
        if not cursor.fetchone():
            conn.close()
            return False, "Centro de acopio no encontrado"

        # Verifica si el ID del material existe
        cursor.execute("SELECT * FROM Materiales WHERE id = ?", (data['id_material'],))
        if not cursor.fetchone():
            conn.close()
            return False, "ID de material no encontrado"

        # Intenta insertar el nuevo cambio
        try:
            cursor.execute('''
                INSERT INTO Cambios (id, codigo_centro_acopio, estudiante, fecha_transaccion, monto, id_material, cantidad)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                data['id'],
                data['codigo_centro_acopio'],
                data['estudiante'],
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                data['monto'],
                data['id_material'],
                data['cantidad']
            ))
            conn.commit()
            conn.close()
            return True, "Cambio creado exitosamente"
        except sqlite3.Error as e:
            conn.close()
            return False, f"Error al insertar el cambio: {e}"
    else:
        return False, "Error de conexión a la base de datos"
