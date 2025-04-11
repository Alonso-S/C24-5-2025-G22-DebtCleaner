FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt /app/

# Instalar dependencias 
RUN pip install --no-cache-dir -r requirements.txt

# Copiar los archivos del proyecto
COPY . /app/

# Definir el PYTHONPATH
ENV PYTHONPATH=/app

# Exponer el puerto para la app
EXPOSE 8000

# Comando para ejecutar el servidor con Uvicorn (FastAPI)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
