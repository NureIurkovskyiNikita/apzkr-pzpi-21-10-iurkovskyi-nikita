import psycopg2
from decouple import config
from rest_framework.response import Response

#з'єднання з базою даних
def connect_to_database():
    return psycopg2.connect(
        user="postgres",
        password="123",
        host="127.0.0.1",
        port="5432",
        database="order_db"
    )

#від'єднання від бази даних
def disconnect_from_database(connection, cursor):
    if connection:
        cursor.close()
        connection.close()

#функція зворотнього визову для обробки отриманих даних
def executeRequest(request_string, query_proc_func, container, request_type):
    ps_connection = None
    cursor = None

    try:
        ps_connection = connect_to_database()

        cursor = ps_connection.cursor()
        cursor.execute(request_string)
        if request_type == 'GET':
            fetch_data = cursor.fetchall()
            query_proc_func(fetch_data, container)
        else:
            ps_connection.commit()

    except (Exception, psycopg2.DatabaseError) as error:
        print("Error while connecting to PostgreSQL", error)
    finally:
        disconnect_from_database(ps_connection, cursor)
    if request_type == 'GET':
        return Response(container)

#функція зворотнього визову для запросів GET
def save_response_data_to_list(requested_data, container):
    for row in requested_data:
        row_data = list()
        for column_data in row:
            row_data.append(column_data)
        container.append(row_data)
