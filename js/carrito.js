class Carrito {
  //añadir el producto al carrito
    comprarProducto(e){
      e.preventDefault();
      if(e.target.classList.contains('agregar-carrito')){
        const producto = e.target.parentElement.parentElement;
        this.leerDatosProducto(producto);
        
      }
    }

    leerDatosProducto(producto){
      const infoProducto = {
         titulo : producto.querySelector('h5').textContent,
         precio : producto.querySelector('.precio').textContent,
         id : producto.querySelector('a').getAttribute('data-id'),
         cantidad : 1
    }
    //Para no agregar dos productos iguales al carrito
    let productosLS;
    productosLS = this.obtenerProductosLocalStorage();
    productosLS.forEach(function(productoLS){
        if(productoLS.id === infoProducto.id){
          productosLS = productoLS.id;
        }
    });
    if(productosLS === infoProducto.id){
      Swal.fire('Any fool can use a computer');
    }
    else{
      this.insertarCarrito(infoProducto);
     }
    
  }

    insertarCarrito(producto){
      const row = document.createElement('tr');
      row.innerHTML = `
      
      <td>${producto.titulo}</td>
      <td>${producto.precio}</td>
      <td> <input type="number" min="1" value="1"></td>
      <td> <a href="" class="borrar-producto btn btn-secondary" data-id="${producto.id}">X</a></td>
        `;
      listaProductos.appendChild(row);
      this.guardarProductosLocalStorage(producto);
    }

    eliminarProducto(e){
      e.preventDefault();
      let producto, productoID;
      if(e.target.classList.contains('borrar-producto')){
        e.target.parentElement.parentElement.remove();
        producto = e.target.parentElement.parentElement;
        productoID = producto.querySelector('a').getAttribute('data-id');
      }
      this.eliminarProductoLocalStorage(productoID);
      this.calcularTotal();
    }

    vaciarCarrito(e){
      e.preventDefault();
      while(listaProductos.firstChild){
        listaProductos.removeChild(listaProductos.firstChild);
      }
      this.vaciarLocalStorage();
      return false;
    }

    guardarProductosLocalStorage(producto){
      let productos;
      productos = this.obtenerProductosLocalStorage();
      productos.push(producto);
      localStorage.setItem('productos', JSON.stringify(productos));

    }

    obtenerProductosLocalStorage(){
      let productoLS;
      if(localStorage.getItem('productos') === null){
        productoLS = [];
      } 
      else {
        productoLS = JSON.parse(localStorage.getItem('productos'));
      }
      return productoLS;
    }
// Elimino el producto en el local store
    eliminarProductoLocalStorage(productoID){
      let productosLS;
      productosLS = this.obtenerProductosLocalStorage();
      productosLS.forEach(function(productoLS, index){
              if(productoLS.id === productoID){
                productosLS.splice(index,1);
              }
      });
      localStorage.setItem('productos', JSON.stringify(productosLS)); 
    }
 //leer los productos del local store, para cuando reinicie la pagina no pierda lo que habia agregado.
    leerLocalStorage(){
      let productosLS;
      productosLS = this.obtenerProductosLocalStorage();
      productosLS.forEach(function(producto){
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${producto.titulo}</td>
        <td>${producto.precio}</td>
        <td> <input type="number" min="1" value="1"></td>
        <td> <a href="" class="borrar-producto btn btn-secondary" data-id="${producto.id}">X</a></td>
          `;
        listaProductos.appendChild(row);
    });
  }

  vaciarLocalStorage(){
    localStorage.clear();
  }

  procesarPedido(e){
    e.preventDefault();
    if(this.obtenerProductosLocalStorage().length === 0){
      console.log('carrito vacio');
    }else{ location.href = "compra.html"; }
    
  }


  leerLocalStorageCompra(){
    let productosLS;
    productosLS = this.obtenerProductosLocalStorage();
    productosLS.forEach(function(producto){
      
      const row = document.createElement('tr');
      row.innerHTML = `
      <td>${producto.titulo}</td>
      <td>${producto.precio}</td>
      <td> <input type="number" class="form-control cantidad" min="1" value=${producto.cantidad}></td>
      <td> ${producto.precio * producto.cantidad} </td>
      <td> <a href="" class="borrar-producto btn btn-secondary" data-id="${producto.id}">X</a></td>
        `;
      listaCompra.appendChild(row);
  });
}

calcularTotal(){
  let productoLS;
  let total = 0, subtotal = 0, IVA = 0;
  productoLS = this.obtenerProductosLocalStorage();
  for(let i = 0; i < productoLS.length; i++){
    let element = Number(productoLS[i].precio * productoLS[i].cantidad);
    
    total = total + element;
  }
  IVA = parseFloat(total * 0.21).toFixed(2);
  subtotal = parseFloat(total-IVA).toFixed(2);

  document.getElementById('subtotal').innerHTML = "$ " + subtotal;
  document.getElementById('IVA').innerHTML = "$ " + IVA;
  document.getElementById('precioTotal').innerHTML = "$ " + total.toFixed(2);
}


}




