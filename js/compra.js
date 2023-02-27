const compra = new Carrito();
const listaCompra= document.querySelector('#lista-compra tbody');
//const carrito = document.getElementById('carrito');
const procesarCompraBtn = document.getElementById('compra');
const cliente = document.getElementById('cliente');
const email = document.getElementById('email');
const direc = document.getElementById('direccion');
const cel = document.getElementById('celular');


cargarEventos();
function cargarEventos(){
    document.addEventListener('DOMContentLoaded', compra.leerLocalStorageCompra());
    compra.calcularTotal();
   //carrito.addEventListener('click', (e)=>{compra.eliminarProducto(e)});
    compra.calcularTotal();
    procesarCompraBtn.addEventListener('click', procesarCompra);
}


function procesarCompra(e){
    e.preventDefault();
   if(cliente.value === '' || email.value === '' || direc.value === '' || cel.value === ''){
     console.log('INGRESAR TODOS LOS CAMPOS REQUERIDOS');
   }
   else {

     const cargandoGif = document.querySelector('#cargando');
     cargandoGif.style.display = 'block';

     const enviado = document.createElement('img');
     enviado.src = 'img/confirm.gif';
     enviado.style.display = 'block';
     enviado.style.textAlign = 'center';

     setTimeout(() =>{
        cargandoGif.style.display = 'none';
        document.querySelector('#loaders').appendChild(enviado);
        setTimeout(() => {
            enviado.remove();
            compra.vaciarLocalStorage();
            window.location = 'index.html';
        }, 2000);
    }, 2000);


   }
}