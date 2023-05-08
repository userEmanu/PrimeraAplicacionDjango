const results = "https://api.escuelajs.co/api/v1/products";

fetch(results)
  .then(response => response.json())
  .then(data => {  
    data.forEach(producto => {
      const article = document.createRange().createContextualFragment(/*html*/ 
      `
        <div class="product" id="product">
          <div class="img">
            <img src="${producto.images}" alt="Спасибо">
          </div>
          <h3>${producto.title}</h3>
          <p>${producto.description}</p>
          <span class="precioProducto">
            ${producto.price}
          </span>
          <button id="agregar${producto.id}" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button> 
        </div>
      `);

      const main = document.getElementById("products");

      main.append(article);

      const boton = document.getElementById(`agregar${producto.id}`);

      boton.addEventListener('click', () => {
        agregarAlCarrito(producto.id, data);
      });
    });      
  });

const contenedorCarrito = document.getElementById('carrito-contenedor');

const botonVaciar = document.getElementById('vaciar-carrito')

const contadorCarrito = document.getElementById('contadorCarrito')

const precioTotal = document.getElementById('precioTotal')

let carrito = [];

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        actualizarCarrito()
    }
})

botonVaciar.addEventListener('click', () => {
    carrito.length = 0
    actualizarCarrito()
})

const agregarAlCarrito = (prodId, data) => {
  const item = data.find((prod) => prod.id === prodId);
  carrito.push(item);
  actualizarCarrito();
  console.log(carrito);
};

const eliminarDelCarrito = (prodId) => {
  const item = carrito.find((prod) => prod.id === prodId);
  const indice = carrito.indexOf(item);
  carrito.splice(indice, 1);
  actualizarCarrito();
};

const actualizarCarrito = () => {
  contenedorCarrito.innerHTML = "";

  carrito.forEach((prod) => {
    const div = document.createElement('div');
    div.className = ('productoEnCarrito');
    div.innerHTML = `
      <p>${prod.title}</p>
      <p>Precio: ${prod.price}</p>
      <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
      <button onclick='eliminarDelCarrito(${prod.id})' class="boton-eliminar"><i class="fas fa-trash-alt"</button>
    `;
    contenedorCarrito.appendChild(div);
    
    localStorage.setItem('carrito', JSON.stringify(carrito))

  });

  contadorCarrito.innerText = carrito.length
  precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.price, 0)

};