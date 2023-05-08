from flask import Flask, request, render_template
import pymongo as mongo


app = Flask(__name__)

app.config['UPLOAD_FOLDER']='./static/images'

miConexion = mongo.MongoClient("mongodb://localhost:27017/") 
baseDatos = miConexion["negocioAdso"] 
productos = baseDatos["productos"]
categorias = baseDatos["categorias"]

@app.route("/")
def inicio():
    return render_template("inicio.html")

from controlador.controllerCategoria import *
from controlador.controllerProducto import *

if __name__=='__main__':
    app.run(port=3000,debug=True)