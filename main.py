import sqlite3
from sqlite3 import Error
import datetime
import random
import string

def create_connection(db_file):
    """ create a database connection to a SQLite database """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        print("Connection is established: Database is created in memory")
    except Error as e:
        print(e)
    return conn

def create_table(conn, create_table_sql):
    """ create a table from the create_table_sql statement """
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        print(e)

def generate_id(prefix):
    """ Generate a unique prefixed 12-character alphanumeric ID """
    characters = string.ascii_letters + string.digits
    random_id = prefix + ''.join(random.choice(characters) for i in range(12))
    return random_id

def insert_material(conn, material):
    """
    Create a new material into the Materiales table
    :param conn:
    :param material:
    :return: material id
    """
    sql = ''' INSERT INTO Materiales(id, nombre, unidad, valor_unitario, estado, fecha_creacion, descripcion)
              VALUES(?,?,?,?,?,?,?) '''
    cur = conn.cursor()
    cur.execute(sql, material)
    return cur.lastrowid

def main():
    database = "reciclaje.db"

    # SQL para crear las tablas necesarias
    sql_create_materiales_table = """ CREATE TABLE IF NOT EXISTS Materiales (
                                        id text PRIMARY KEY,
                                        nombre text NOT NULL CHECK(LENGTH(nombre) BETWEEN 5 AND 30),
                                        unidad text NOT NULL CHECK(unidad IN ('Kilogramo', 'Litro', 'Unidad')),
                                        valor_unitario real CHECK (valor_unitario >= 0 AND valor_unitario <= 100000),
                                        estado boolean NOT NULL DEFAULT 1,
                                        fecha_creacion text NOT NULL,
                                        descripcion text CHECK (LENGTH(descripcion) <= 1000)
                                    ); """

    sql_create_sedes_table = """ CREATE TABLE IF NOT EXISTS Sedes (
                                        id text PRIMARY KEY,
                                        nombre text NOT NULL UNIQUE,
                                        ubicacion text NOT NULL,
                                        estado boolean NOT NULL,
                                        numero_contacto text NOT NULL
                                    ); """

    sql_create_centros_de_acopio_table = """ CREATE TABLE IF NOT EXISTS CentrosDeAcopio (
                                                codigo TEXT PRIMARY KEY,
                                                ubicacion TEXT NOT NULL,
                                                estado BOOLEAN NOT NULL,
                                                numero_contacto TEXT NOT NULL,
                                                id_sede TEXT NOT NULL,
                                                usuario_creador TEXT NOT NULL,
                                                fecha_creacion TEXT NOT NULL,
                                                FOREIGN KEY (id_sede) REFERENCES Sedes(id)
                                            ); """

    sql_create_cambios_table = """ CREATE TABLE IF NOT EXISTS Cambios (
                                        id TEXT PRIMARY KEY,
                                        codigo_centro_acopio TEXT NOT NULL,
                                        estudiante TEXT NOT NULL,
                                        fecha_transaccion TEXT NOT NULL,
                                        monto INTEGER NOT NULL,
                                        id_material TEXT NOT NULL CHECK (id_material LIKE 'M-____________'),
                                        cantidad INTEGER NOT NULL,
                                        estado INTEGER NOT NULL,  -- Nueva columna para el estado de la transacción
                                        FOREIGN KEY (codigo_centro_acopio) REFERENCES CentrosDeAcopio(codigo),
                                        FOREIGN KEY (id_material) REFERENCES Materiales(id)
                                    ); """
    sql_create_usuarios_table = """ CREATE TABLE IF NOT EXISTS Usuarios (
                                    Usuario TEXT PRIMARY KEY,
                                    Contraseña TEXT NOT NULL,
                                    Permisos TEXT NOT NULL CHECK (Permisos IN ('Admin', 'Estudiante', 'Centro de Acopio')),
                                    Codigo_Centro_Acopio TEXT,
                                    FOREIGN KEY (Codigo_Centro_Acopio) REFERENCES CentrosDeAcopio(codigo)
                                ); """

    # Crear conexión a la base de datos
    conn = create_connection(database)

    # Crear las tablas
    if conn is not None:
        create_table(conn, sql_create_materiales_table)
        create_table(conn, sql_create_sedes_table)
        create_table(conn, sql_create_centros_de_acopio_table)
        create_table(conn, sql_create_cambios_table)
        create_table(conn, sql_create_usuarios_table)
    else:
        print("Error! cannot create the database connection.")

    # Insertar un material de ejemplo (opcional)
    with conn:
        new_material_id = generate_id('M-')
        new_material = (new_material_id, 'pruebaDATOS', 'Kilogramo', 15.5, True, datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), 'Papel reciclable')
        material_id = insert_material(conn, new_material)
        print(f"Material with ID {material_id} created successfully.")

if __name__ == '__main__':
    main()
