$(function () {
  $("#fileFoto").on("change", validarImagen)
})
/**
 * 
 * @param {*} idProducto 
 */
function abrirModalEliminar(idProducto){
    Swal.fire({
        title: 'Eliminar Producto',
        text: "¿Estan seguros de eliminar?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No',
        confirmButtonText: 'Si'
      }).then((result) => {
        if (result.isConfirmed) {
           location.href="/elminarProducto/"+idProducto+"/"
        }
      })
}
// function abrirModalEditar(idProducto){
//     Swal.fire({
//         title: 'Editar Producto',
//         text: "¿Estan seguros de Editar?",
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         cancelButtonText: 'No',
//         confirmButtonText: 'Si'
//       }).then((result) => {
//         if (result.isConfirmed) {
//            location.href="/consultarProducto/"+idProducto+"/"
//         }
//       })
// }

function validarImagen(evt) {
  let files = evt.target.files
  let nombre = files[0].name
  let tamaño = files[0].size
  let extension = nombre.split('.').pop()
  extension = extension.toLowerCase()
  if (extension != "jpg") {
    Swal.fire('cargar imagen producto',
      'la imagen debe tener extension jpg',
      'warning')
    $("#fileFoto").val("")
  }

  if (tamaño > 50000) {
    Swal.fire('cargar imagen producto',
      'la imagen no debe superar los 50 k',
      'warning')
    $("#fileFoto").val("")
  }
}