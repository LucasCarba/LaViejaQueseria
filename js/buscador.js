document.addEventListener('keyup', e=>{

   if(e.target.matches('#buscador')){
    document.querySelectorAll('h5').forEach(elemento =>{
        elemento.textContent.toLowerCase().includes(e.target.value.toLowerCase())
        ?elemento.classList.remove('.filtro')
        :elemento.classList.add('.filtro')
    })

   }
 

})