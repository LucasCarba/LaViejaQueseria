//=============Capturamos Objetos de HTML: DOM ======================= 
const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateCard = document.getElementById("template-cards").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragment = document.createDocumentFragment();
let carrito = {};


//============== Local Storage: memoria del navegador =================
//este evento se activa cuando se carga el contenido del DOM, sin esperar a que las imágenes y las hojas de estilo (es decir, los recursos externos) terminen de cargarse.
document.addEventListener("DOMContentLoaded", () => {
    fetchdata();
    localStorage.getItem("carrito") && (carrito = JSON.parse(localStorage.getItem("carrito")))
});

//función asíncrona (obtiene los datos cuando puede conectarse a un recurso externo)
//para obtener los datos
const fetchdata = async() => {
    //manejo de errores
    //fetch proporciona una forma fácil y lógica de obtener recursos de forma asíncrona por la red.
    //El operador await es usado para esperar a una Promise. Sólo puede ser usado dentro de una función async function.
    try {
        const respuesta = await fetch('productos.json');
        const data = await respuesta.json();
        console.log(data);
        pintarCards(data)
    } catch (error) {
        console.log('Tenemos un error');
    }
}

//Eventos
cards.addEventListener('click', (e) =>{
    addCarrito(e);
});

items.addEventListener('click', (e) =>{
    btnAccion(e);
});

//Funciones
const pintarCards = (data) => {
    data.forEach((producto) =>{
        templateCard.querySelector("h3").textContent = producto.nombre;
        templateCard.querySelector("p.precio").textContent = producto.precio;
        templateCard.querySelector("p.fecha").textContent = producto.fecha;
        templateCard.querySelector("p.lugar").textContent = producto.lugar;
        templateCard.querySelector("img").setAttribute("src", producto.img);
        templateCard.querySelector(".btn-dark").dataset.id = producto.id;
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment);
};

const addCarrito = (e) => {
    if (e.target.classList.contains("btn-dark")) {
        setCarrito(e.target.parentElement);

        Swal.fire({
            title: "Felicitaciones!",
            text: "El producto se ha agregado al carrito",
            icon: "success",
            confirmButtonText: "Ok",
        });
    }
    e.stopPropagation();
};

const setCarrito = (objeto) => {
    const producto = {
        id: objeto.querySelector(".btn-dark").dataset.id,
        nombre: objeto.querySelector(".nombre").textContent,
        precio: objeto.querySelector(".precio").textContent,
        fecha: objeto.querySelector(".fecha").textContent,
        lugar: objeto.querySelector(".lugar").textContent,
        cantidad: 1,
    };
    // Aumeto la cantidad cuando se compran mas de 1 producto
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }
    // Sumo productos al carrito y USO DE SPREAD OPERATOR
    carrito[producto.id] = { ...producto };
    pintarCarrito();
};

const pintarCarrito = () => {
    items.innerHTML = "";
    Object.values(carrito).forEach((producto) => {
        templateCarrito.querySelector("th").textContent = producto.id;
        templateCarrito.querySelectorAll("td")[0].textContent = producto.nombre;
        templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
        templateCarrito.querySelector("span").textContent =
            producto.precio*producto.cantidad;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);
    pintarFooter();
    localStorage.setItem("carrito", JSON.stringify(carrito));
};

const pintarFooter = () => {
    footer.innerHTML = "";
    // Carrito vacio
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Su carrito está vacío!</th>
        `;
        return;
    }
    const nCantidad = Object.values(carrito).reduce(
        (acc, { cantidad }) => acc + cantidad,
        0
    );
    const nPrecio = Object.values(carrito).reduce(
        (acc, { cantidad, precio }) => acc + cantidad * precio,
        0
    );

    templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
    templateFooter.querySelector("span").textContent = nPrecio;

    const clone = templateFooter.cloneNode(true);

    fragment.appendChild(clone);
    footer.appendChild(fragment);

    const btnVaciar = document.getElementById("vaciar-carrito");

    btnVaciar.addEventListener("click", () => {
        carrito = {};
        pintarCarrito();

        Swal.fire({
            title: "El carrito se ha vaciado!",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
        });
    });
};

const btnAccion = (e) => {
    // Aumentar USO DE OPERADOR ++
    if (e.target.classList.contains("btn-info")) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++;
        carrito[e.target.dataset.id] = { ...producto };
        pintarCarrito();

        Swal.fire({
            title: "Cool!",
            text: "Has agregado un producto más al carrito",
            icon: "success",
            confirmButtonText: "Ok",
        });
    }
    // Disminuir
    if (e.target.classList.contains("btn-danger")) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--;
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id];
        }
        pintarCarrito();

        Swal.fire({
            title: "Que lastima!",
            text: "El producto se ha quitado del carrito",
            icon: "warning",
            confirmButtonText: "Ok",
        });
    }
    e.stopPropagation();
};