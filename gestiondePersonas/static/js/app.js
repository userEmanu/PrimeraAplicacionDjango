listaPersonas=[]
let mensajeValidarDatos=""

/**
 * validarDatos() => es una funcion que valida 
 * que todos los datos o datos requerido esten ingresados.
 * @returns true o false
 * true si relleno todo bien o false si faltan datos
 */
function validarDatos(){
    let identificacion = document.getElementById("txtIdentificacion")
    let nombre = document.getElementById("txtNombre")
    let correo = document.getElementById("txtCorreo")
    let fechaNacimiento = document.getElementById("txtFechaNacimiento")
    
    if(identificacion.value==""){
        mensajeValidarDatos="Debe ingresar la Identificación"
        return false;
    }else if(nombre.value==""){
        mensajeValidarDatos="Debe ingresar el nombre"
        return false;
    }else if(correo.value==""){
        mensajeValidarDatos="Debe ingresar el correo electrónico"
        return false;
    }else if(fechaNacimiento.value==""){
        mensajeValidarDatos="Debe seleccionar fecha de Nacimiento"
        return false;
    }else{
        return true;
    }
}

/**
 * mostrarDatosTabla() => funcion que saca datos de la listaPeronas
 * para imprimirlos en una tabla llamada 'datosPersonas'
 */
function mostrarDatosTabla(){
    let datos=""
    listaPersonas.forEach(persona => {
        datos += "<tr>"
        datos += "<td>" + persona[0] + "</td>"
        datos += "<td>" + persona[1] + "</td>"
        datos += "<td>" + persona[2] + "</td>"
        datos += "<td>" + persona[3] + "</td>"
        datos += "</tr>"
    });
    document.getElementById("datosPersonas").innerHTML = datos
}

/**
 * agregar()=>
 * se le hace al servidor(app.py) una peticion mediante funcion FECTH
 * donde retorna un 'Mensaje, estado(true/false) y una lista llamada listaPersonas'
 */
function agregar(){   
    if(validarDatos()){
        const data = new FormData(document.getElementById("frmPersonas"));
        const url = "/agregar";
        fetch(url,{method:"POST",body:data})
        .then(respuesta=>respuesta.json())
        .then(resultado=>{
            console.log(resultado);
            if(resultado.estado){
                limpiar()
                Swal.fire("Registro Persona",resultado.mensaje,"success");
                listaPersonas = resultado.listaPersonas
                mostrarDatosTabla()
            }else{
                Swal.fire("Registro Persona",resultado.mensaje,"warning");
            }
        })
        .catch(error=>console.log(error))

    }else{
        Swal.fire("Registro Persona",mensajeValidarDatos,"warning");
    }

}

/**
 * consultarPorIdentificacion()=> consulta por medio de un dato(txtidentificacion)
 * a la lista local, si se encuentra o el dato buscado esta en la lista muestra 
 * todos los datos en la tablas, sino elimina los datos del formulario, y tambien retorna un 
 * mensaje con Swal.fire
 */
function consultarPorIdentificacion(){
    let identificacion = document.getElementById("txtIdentificacion")
    let existe=false
    if(identificacion.value!=""){
        listaPersonas.forEach(persona => {
            if(persona[0]==identificacion.value){
                document.getElementById("txtIdentificacion").value=persona[0]
                document.getElementById("txtNombre").value=persona[1]
                document.getElementById("txtCorreo").value=persona[2]
                document.getElementById("txtFechaNacimiento").value=persona[3]
                document.getElementById("txtIdAnterior").value=persona[0]
                existe=true
            }
        });
        if(!existe){
            document.getElementById("txtNombre").value=""
            document.getElementById("txtCorreo").value=""
            document.getElementById("txtFechaNacimiento").value=""
            let mensaje="No existe persona con esa identificación"
            Swal.fire("Consultar Persona",mensaje,"warning");
        }
    }else{
        Swal.fire("Consultar Persona","Debe ingresar identificación para consultar","warning");
    }
}

/**
 * Petición al servidor mediate API fetch para actualizar una persona.
 */
function actualizar(){   
    if(validarDatos()){
        const data = new FormData(document.getElementById("frmPersonas"));
        const url = "/actualizar";
        fetch(url,{method:"POST",body:data})
        .then(respuesta=>respuesta.json())
        .then(resultado=>{
            console.log(resultado);
            if(resultado.estado){
                limpiar()
                Swal.fire("Actualizar Persona",resultado.mensaje,"success");
                listaPersonas = resultado.listaPersonas
                mostrarDatosTabla()
            }else{
                Swal.fire("Actualizar Persona",resultado.mensaje,"warning");
            }
        })
        .catch(error=>console.log(error))

    }else{
        Swal.fire("Registro Persona",mensajeValidarDatos,"warning");
    }

}


function eliminar(){   
    if(validarDatos()){
        ide = document.getElementById('txtIdentificacion').value;
        Swal.fire({
            title: '¿Estas seguro?',
            html: "Quieres eliminar a la persona <br><center> con la identificacion <b>"+ ide + "</b></center>",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonColor: 'No'
          }).then((result) => {
            if (result.isConfirmed) {
                 const data = new FormData(document.getElementById("frmPersonas"));
                 const url = "/eliminar";
                 fetch(url,{method:"POST",body:data})
                 .then(respuesta=>respuesta.json())
                 .then(resultado=>{
                    console.log(resultado);
                    if(resultado.estado){
                        limpiar()
                        Swal.fire("Persona eliminada",resultado.mensaje,"success");
                        listaPersonas = resultado.listaPersonas
                        mostrarDatosTabla()
                    }else{
                        Swal.fire("Persona no eliminada",resultado.mensaje,"warning");
                    }
                 })
                 .catch(error=>console.log(error))
            }else{

            }
          })        
    }else{
        Swal.fire("Falta datos",mensajeValidarDatos,"warning");
    }

}


/**
 * Limpiar formulario para que las cajas de texto
 * queden sin datos
 */
function limpiar(){
    document.getElementById("txtIdentificacion").value=""
    document.getElementById("txtNombre").value=""
    document.getElementById("txtCorreo").value=""
    document.getElementById("txtFechaNacimiento").value=""
}

/**
 * Petición al servidor mediante API fetch para obtener
 * la lista de personas al cargar el html
 */
function iniciar(){   
    const url = "/iniciar";
    fetch(url,{method:"GET"})
    .then(respuesta=>respuesta.json())
    .then(resultado=>{
        console.log(resultado);                        
        listaPersonas = resultado.listaPersonas
        mostrarDatosTabla()
    })
    .catch(error=>console.log(error))
}
