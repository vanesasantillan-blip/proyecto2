const productosIniciales = [
  { id: 1, nombre: "Osito de peluche", precio: 8500, categoria: "peluches", emoji: "🧸", descripcion: "Suave y listo para acompañarte." },
  { id: 2, nombre: "Conejito de peluche", precio: 7200, categoria: "peluches", emoji: "🐰", descripcion: "Un amigo tierno para abrazar." },
  { id: 3, nombre: "Bloques de construcción", precio: 12500, categoria: "construccion", emoji: "🧱", descripcion: "Armá todo lo que puedas imaginar." },
  { id: 4, nombre: "Auto de carreras", precio: 5900, categoria: "vehiculos", emoji: "🏎️", descripcion: "¡Preparado para la carrera!" },
  { id: 5, nombre: "Tren de juguete", precio: 9800, categoria: "vehiculos", emoji: "🚂", descripcion: "Un viaje lleno de aventuras." },
  { id: 6, nombre: "Juego de memoria", precio: 6400, categoria: "juegos", emoji: "🧠", descripcion: "Entrená la memoria jugando." },
  { id: 7, nombre: "Rompecabezas", precio: 7800, categoria: "juegos", emoji: "🧩", descripcion: "Un desafío divertido para resolver." },
  { id: 8, nombre: "Kit de dinosaurios", precio: 11300, categoria: "construccion", emoji: "🦖", descripcion: "Creá tu propio mundo jurásico." }
];

let carrito = [];
let favoritos = [];

const contenedorProductos = document.getElementById("productos");
const buscador = document.getElementById("buscador");
const filtroCategoria = document.getElementById("filtroCategoria");
const ordenPrecio = document.getElementById("ordenPrecio");
const contenidoCarrito = document.getElementById("contenidoCarrito");
const totalCarrito = document.getElementById("totalCarrito");
const contadorCarrito = document.getElementById("contadorCarrito");
const notificacion = document.getElementById("notificacion");
let temporizadorMensaje;

function formatoPrecio(precio) {
  return precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  });
}

function nombreCategoria(categoria) {
  const nombres = {
    peluches: "Peluches",
    juegos: "Juegos de mesa",
    construccion: "Construcción",
    vehiculos: "Vehículos"
  };
  return nombres[categoria] || categoria;
}

function mostrarMensaje(mensaje) {
  notificacion.textContent = mensaje;
  notificacion.classList.add("visible");
  clearTimeout(temporizadorMensaje);
  temporizadorMensaje = setTimeout(() => {
    notificacion.classList.remove("visible");
  }, 2400);
}

function mostrarProductos() {
  const texto = buscador.value.trim().toLowerCase();
  const categoriaElegida = filtroCategoria.value;
  let lista = productosIniciales.filter(producto => {
    const coincideTexto = producto.nombre.toLowerCase().includes(texto) ||
      producto.descripcion.toLowerCase().includes(texto);
    const coincideCategoria = categoriaElegida === "todos" ||
      producto.categoria === categoriaElegida;
    return coincideTexto && coincideCategoria;
  });

  if (ordenPrecio.value === "menor") {
    lista.sort((a, b) => a.precio - b.precio);
  } else if (ordenPrecio.value === "mayor") {
    lista.sort((a, b) => b.precio - a.precio);
  }

  document.getElementById("mensajeResultados").textContent =
    lista.length + (lista.length === 1 ? " juguete encontrado." : " juguetes encontrados.");

  if (lista.length === 0) {
    contenedorProductos.innerHTML = '<p class="sin-resultados">No encontramos juguetes con esa búsqueda. Probá con otra palabra.</p>';
    return;
  }

  contenedorProductos.innerHTML = lista.map(producto => `
    <article class="tarjeta-producto">
      <button class="favorito ${favoritos.includes(producto.id) ? "activo" : ""}"
        data-favorito="${producto.id}" aria-label="Agregar o quitar de favoritos">
        ${favoritos.includes(producto.id) ? "❤️" : "♡"}
      </button>
      <div class="imagen-producto" role="img" aria-label="${producto.nombre}">${producto.emoji}</div>
      <div class="detalle-producto">
        <span class="categoria">${nombreCategoria(producto.categoria)}</span>
        <h3 class="nombre-producto">${producto.nombre}</h3>
        <p class="descripcion">${producto.descripcion}</p>
        <div class="pie-producto">
          <span class="precio">${formatoPrecio(producto.precio)}</span>
          <button class="boton boton-principal agregar" data-agregar="${producto.id}">＋ Agregar</button>
        </div>
      </div>
    </article>
  `).join("");
}

function agregarAlCarrito(id) {
  const producto = productosIniciales.find(item => item.id === id);
  const productoEnCarrito = carrito.find(item => item.id === id);

  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  mostrarCarrito();
  mostrarMensaje(producto.nombre + " se agregó al carrito.");
}

function cambiarCantidad(id, cambio) {
  const producto = carrito.find(item => item.id === id);
  if (!producto) return;
  producto.cantidad += cambio;

  if (producto.cantidad <= 0) {
    carrito = carrito.filter(item => item.id !== id);
    mostrarMensaje("Producto eliminado del carrito.");
  }
  mostrarCarrito();
}

function eliminarDelCarrito(id) {
  const producto = carrito.find(item => item.id === id);
  if (!producto) return;
  carrito = carrito.filter(item => item.id !== id);
  mostrarCarrito();
  mostrarMensaje(producto.nombre + " se eliminó del carrito.");
}

function mostrarCarrito() {
  if (carrito.length === 0) {
    contenidoCarrito.innerHTML = '<p class="carrito-vacio">Todavía no agregaste juguetes. ¡Elegí uno del catálogo!</p>';
  } else {
    contenidoCarrito.innerHTML = carrito.map(producto => `
      <div class="item-carrito">
        <span class="emoji-carrito">${producto.emoji}</span>
        <div>
          <div class="nombre-carrito">${producto.nombre}</div>
          <div class="precio-carrito">${formatoPrecio(producto.precio)} cada uno</div>
        </div>
        <div class="cantidad">
          <button data-restar="${producto.id}" aria-label="Restar uno">−</button>
          <span>${producto.cantidad}</span>
          <button data-sumar="${producto.id}" aria-label="Sumar uno">＋</button>
        </div>
        <strong class="subtotal">${formatoPrecio(producto.precio * producto.cantidad)}</strong>
        <button class="eliminar" data-eliminar="${producto.id}">Quitar</button>
      </div>
    `).join("");
  }

  const cantidadTotal = carrito.reduce((suma, producto) => suma + producto.cantidad, 0);
  const precioTotal = carrito.reduce((suma, producto) => suma + producto.precio * producto.cantidad, 0);
  contadorCarrito.textContent = cantidadTotal;
  totalCarrito.textContent = formatoPrecio(precioTotal);
}

contenedorProductos.addEventListener("click", evento => {
  const botonAgregar = evento.target.closest("[data-agregar]");
  const botonFavorito = evento.target.closest("[data-favorito]");

  if (botonAgregar) agregarAlCarrito(Number(botonAgregar.dataset.agregar));

  if (botonFavorito) {
    const id = Number(botonFavorito.dataset.favorito);
    if (favoritos.includes(id)) {
      favoritos = favoritos.filter(favorito => favorito !== id);
      mostrarMensaje("Se quitó de favoritos.");
    } else {
      favoritos.push(id);
      mostrarMensaje("¡Juguete agregado a favoritos!");
    }
    mostrarProductos();
  }
});

contenidoCarrito.addEventListener("click", evento => {
  const restar = evento.target.closest("[data-restar]");
  const sumar = evento.target.closest("[data-sumar]");
  const eliminar = evento.target.closest("[data-eliminar]");

  if (restar) cambiarCantidad(Number(restar.dataset.restar), -1);
  if (sumar) cambiarCantidad(Number(sumar.dataset.sumar), 1);
  if (eliminar) eliminarDelCarrito(Number(eliminar.dataset.eliminar));
});

buscador.addEventListener("input", mostrarProductos);
filtroCategoria.addEventListener("change", mostrarProductos);
ordenPrecio.addEventListener("change", mostrarProductos);

document.getElementById("modoOscuro").addEventListener("click", () => {
  document.body.classList.toggle("oscuro");
  const activado = document.body.classList.contains("oscuro");
  document.getElementById("modoOscuro").textContent = activado ? "☀️ Modo claro" : "🌙 Modo oscuro";
  mostrarMensaje(activado ? "Modo oscuro activado." : "Modo claro activado.");
});

document.getElementById("finalizarCompra").addEventListener("click", () => {
  if (carrito.length === 0) {
    mostrarMensaje("Tu carrito está vacío. Agregá un juguete primero.");
    return;
  }
  mostrarMensaje("¡Compra de prueba realizada! Gracias por elegir Mundo Juguetón.");
  carrito = [];
  mostrarCarrito();
});

mostrarProductos();
mostrarCarrito();
