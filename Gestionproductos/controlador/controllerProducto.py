from app import app, db
from Modulo.categoria import *
from Modulo.producto import *
from flask import Flask,render_template,request, redirect
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import exc
from werkzeug.utils import secure_filename
import os

@app.route("/vistaProducto")
def vistaProducto():
    import controlador.controllerCategoria as cat
    listaCategorias= Categoria.query.all()
    producto=[]
    return render_template("frmProducto.html",listaCategorias=listaCategorias,producto=producto)

@app.route("/agregarProducto",methods=["POST"])
def agregarProducto():
    mensaje=""
    estado=False
    try:   
        codigo = int(request.form["txtCodigo"])
        nombre = request.form["txtNombre"]
        precio = int(request.form["txtPrecio"])
        categorias = int(request.form["cbCategoria"])
        producto = Producto(proCodigo = codigo, proNombre = nombre, proPrecio= precio,
                            proCategoria = categorias)
        db.session.add(producto)
        db.session.commit()
        estado = True
        archivo = request.files['fileFoto']
        if(archivo.filename != ""):
            nombre = secure_filename(archivo.filename)
            nuevoNombre = str(producto.idProducto)+".jpg"
            archivo.save(os.path.join(app.config['UPLOAD_FOLDER'], nuevoNombre))          
        mensaje="Producto agregado correctamente"
        return redirect("/listaProductos")
    except exc.SQLAlchemyError as error:   
        db.session.rollback() 
        mensaje = "Problemas al agregar"
    listaCategoria = Categoria.query.all()
    return render_template('frmProducto.html',mensaje=mensaje,
                           producto=listaProductos, estado=estado,  listaCategorias=listaCategoria)


    

@app.route("/listaProductos")
def listaProductos():
    listaProductos= Producto.query.all()
    return render_template("frmListarProductos.html",listaProductos=listaProductos)

@app.route("/eliminar/<int:idProducto>",methods=["POST","GET"])
def eliminar(idProducto):
    mensaje=""
    estado=False
    try:
        producto= Producto.query.get(idProducto)
        db.session.delete(producto)   
        db.session.commit()
        os.remove(app.config['UPLOAD_FOLDER']+"/"+str(idProducto)+".jpg")
        estado=True
        mensaje="Producto Eliminado"
    except  exc.SQLAlchemyError as error:
        db.session.rollback()
        mensaje="Problemas al agregar"
    listaProductos= Producto.query.all()
    return render_template("frmListarProductos.html",listaProductos=listaProductos,mensaje=mensaje,estado=estado)


    
@app.route("/actualizarProducto",methods=["POST"])
def actualizarProducto():
    mensaje=""
    estado=False
    try:   
        idProducto=int(request.form["idProducto"])
        producto = Producto.query.get(idProducto)
        producto.proCodigo = int(request.form["txtCodigo"])
        producto.proNombre = request.form["txtNombre"]
        producto.proPrecio = int(request.form["txtPrecio"])
        producto.proCategoria = int(request.form["cbCategoria"])
        db.session.commit()
        archivo = request.files['fileFoto']
        if(archivo.filename != ""):
            nombre = secure_filename(archivo.filename)
            nuevoNombre = str(producto.idProducto)+".jpg"
            archivo.save(os.path.join(app.config['UPLOAD_FOLDER'], nuevoNombre))  
        return redirect("/listaProductos")
            
    except exc.SQLAlchemyError as error:
        db.session.rollback()
        mensaje=error
        
    listaCategorias = Categoria.query.all()
    return render_template('frmEditarProducto.html',estado=estado,mensaje=mensaje,listarCategorias=listaCategorias,producto=producto)
    
@app.route("/obtenerCategoriasJson" ,methods=["GET"])
def obtenerCategoriasJson():
    listaCategorias = Categoria.query.all()
    listaJson=[]
    for categoria in listaCategorias:
        categoria = {
            "idCategoria":categoria.idCategoria,
            "catNombre": categoria.catNombre
        }
    listaJson.append(categoria)
    return listaJson


@app.route("/actualizarProductoJson" ,methods=["POST"])
def actualizarProductoJson():
	try:
		estado=False
		datos = request.get_json(force=True)
		idProducto= int(datos["idProducto"])
		producto =Producto.query.get(idProducto)
		producto.proCodigo = int(datos["codigo"])
		producto.proNombre = datos["nombre"]
		producto.proPrecio = int(datos["precio"])
		producto.proCategoria = int(datos["categoria"])
		db.session.commit()
		estado=True

		mensaje="Producto Actualizado"
	except exc.SQLAlchemyError as error:
		db.session.rollback()
		mensaje= "Problemas al actualizar el producto"
	return {"mensaje":mensaje, "estado": estado}

@app.route("/agregarProductoJson",methods=[ "POST" ])
def agregarProductoJson():
    estado=False
    try:
        datos = request.get_json(force=True)
        codigo = int(datos["codigo"])
        nombre = datos["nombre"]
        precio = int(datos["precio"])
        categoria = int(datos["categoria"])
        producto = Producto (proCodigo=codigo, proNombre=nombre,
        proPrecio=precio, proCategoria=categoria)
        db.session.add(producto)
        db.session.commit()
        mensaje="Producto Agregado Correctamente"

        estado=True
    except exc.SQLAlchemyError as error:
        db.session.rollback()
        mensaje="Problemas al registrar"
    return {"mensaje":mensaje, "estado": estado}

@app.route("/agregarCategoriaJson",methods=["POST"])
def agregarCategoriajson():
    try:
        datos = request.get_json()
        categoria = Categoria(catNombre = datos["nombreCategoria"])
        db.session.add (categoria)
        db.session.commit()
        mensaje="Categoria agregada"
    except exc.SQLAlchemyError as error:
        db.session.rollback()
        mensaje="problemas al agregar la categoria"
    return {"mensaje":mensaje}

@app.route("/consultarProductoJson", methods=["GET"])
def consultarProductoJson():
    mensaje 
    try:
        datos = request.get_json(force=True)
        idProducto = int(datos["idProducto"])
        producto = Producto.query.get(idProducto)
        productoJson = {
                "idProducto": producto.idProducto,
                "proNombre": producto.proNombre,
                "proPrecio": producto.proPrecio,
                "categoria":{
                        "idCategoria": producto.categoria.idCategoria,
                        "catiombre" : producto.categoria.catNombre
                }
        }
        mensaje="Datos del Producto"
    except exc.SQLAlchemyError as error:
        mensaje = "Problemas al consultar"   
    return {"mensaje":mensaje, "producto" :productoJson}

@app. route("/eliminarProductoJson", methods=["POST"])
def eliminarProductoJson():
    try:
        estado=False
        datos = request.get_json(force=True)
        idProducto = int(datos["idProducto"])
        producto = Producto.query.get(idProducto)
        db.session.delete(producto)
        db.session.commit()
        estado=True
        mensaje="Producto Eliminado"
        nombreArchivo = str(idProducto)+". jpg"
        os.remove(os.path.join (app.config[ "UPLOAD_FOLDER" ]+"/"+nombreArchivo))
    except exc.SQLAlchemyError as error:
        db.session.rollback()
        mensaje = "Problemas al eliminar el producto"
    return {"mensaje":mensaje, "estado" :estado}

@app.route("/listarProductosJson", methods=["GET"])
def listarProductosJson():
    try:
        listaProductos = Producto.query.all()
        listaJson=[]
        for producto in listaProductos:
            producto = {
                "idProducto":producto.idProducto,
                "proNombre": producto.proNombre,
                "proPrecio": producto.proPrecio,
                "categoria": {
                    "idCategoria": producto.categoria.idCategoria,
                    "catNombre" : producto.categoria.catNombre
                }
            }
        listaJson.append(producto)
        mensaje="Lista de Productos"
    except exc.SQLAlchemyError as error:
        mensaje = "Problemas al obtener los productos"
    return {"mensaje":mensaje,"listaProductos":listaJson}
