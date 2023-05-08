from app import db, app
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from Modulo.categoria import *
from Modulo.producto import *

with app.app_context():
    db.create_all()
    
@app.route("/")
def inicio():
    return "Se han creado las tablas en la base de datos"