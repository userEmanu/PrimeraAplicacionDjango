from app import app, db
from Modulo.categoria import *
from flask import Flask,render_template,request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import exc

@app.route("/vistaCategoria")
def vistaCategoria():
    return render_template("frmCategoria.html")

@app.route("/agregarCategoria",methods=["POST"])
def agregarCategoria():
    mensaje=""
    try:
        nombre = request.form["txtNombre"].upper()
        categoria= Categoria(catNombre=nombre)
        db.session.add(categoria)       
        db.session.commit()
        mensaje = "Categoria agregada correctamente"
    except exc.SQLAlchemyError as error:
        db.session.rollback()
        mensaje=str(f"error al agregar categoria")
            
    return render_template("frmCategoria.html",mensaje=mensaje)

@app.route("/listaCategorias")
def categoria():
    listaCategorias= Categoria.query.all()  
    return render_template("frmListarCategorias.html",listaCategorias=listaCategorias)

