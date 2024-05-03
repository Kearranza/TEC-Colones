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

def generate_id():
    """ Generate a unique 'M-' prefixed 12-character alphanumeric ID """
    characters = string.ascii_letters + string.digits
    random_id = 'M-' + ''.join(random.choice(characters) for i in range(12))
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

    sql_create_materiales_table = """ CREATE TABLE IF NOT EXISTS Materiales (
                                        id text PRIMARY KEY,
                                        nombre text NOT NULL CHECK(LENGTH(nombre) BETWEEN 5 AND 30),
                                        unidad text NOT NULL CHECK(unidad IN ('Kilogramo', 'Litro', 'Unidad')),
                                        valor_unitario real CHECK (valor_unitario >= 0 AND valor_unitario <= 100000),
                                        estado boolean NOT NULL DEFAULT 1,
                                        fecha_creacion text NOT NULL,
                                        descripcion text CHECK (LENGTH(descripcion) <= 1000)
                                    ); """

    # create a database connection
    conn = create_connection(database)

    # create materials table
    if conn is not None:
        create_table(conn, sql_create_materiales_table)
    else:
        print("Error! cannot create the database connection.")

    # Insert new material
    with conn:
        new_material_id = generate_id()
        new_material = (new_material_id, 'pruebaDATOS', 'Kilogramo', 15.5, True, datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), 'Papel reciclable')
        material_id = insert_material(conn, new_material)
        print(f"Material with ID {material_id} created successfully.")

if __name__ == '__main__':
    main()