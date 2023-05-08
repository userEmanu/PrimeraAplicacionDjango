from flask import Flask,request,render_template
from flask_sqlalchemy import SQLAlchemy
import pymysql as mysql
import sqlite3
app = Flask(__name__)

# cadenConexion = "mysql+pymysql://root@localhost/TiendaSqlExercise"
cadenaConexion = "sqlite:///basedatos.db"

app.config["SQLALCHEMY_DATABASE_URI"]= cadenaConexion

db = SQLAlchemy(app)

@app.route("/")
def inicio():
    return render_template("inicio.html")

from controlador.controllerCategoria import *
from controlador.controllerProducto import *


if __name__ =="__main__":
    app.run(port=5000,debug=True)