
function inicarApP(){
    const seleccionDeAlimentos=document.querySelector('#select_category')
    const selecciondePreparación=document.querySelector('.container__food')
    const modal=document.querySelector('.modal')
    //titulo del modal
    const title=document.querySelector('.container__modal__title')
    //scroll del modal
    const scrollModal=document.querySelector('.containerScrool')
    //imagen del modal
    const imagenModal=document.querySelector('.container__modal__img')
    //descripcion del alimento
    const descripcionModal=document.querySelector('.container__modal__description')
    //boton cerrar
    const btonClose=document.querySelector('.close')
    //botonguardar
    const btnSave=document.querySelector('.save')
//banner de guardado
    const bannerGuardado=document.querySelector('.recetasAgregadas')
    //contenido
    const bannerContenido=document.querySelector('.recetasAgregadas__contenido')
if(seleccionDeAlimentos){
    seleccionDeAlimentos.addEventListener('change',selecionarCategoria)
    obtenerCategorias();
}
   


const favoritosFood=document.querySelector('#favoritos__food')
    if (favoritosFood) {
       obtenerFavoritos()
    }
   
   
    function obtenerCategorias(){
        const url="https://www.themealdb.com/api/json/v1/1/categories.php"
      fetch(url)
        .then(response=>{
            if(!response.ok){
                throw("hubo un error")
            }
            return response.json()
        })
        .then(dato=>{
           mostrarCategorias(dato.categories)
        }).
        catch(error=>console.log("hubo un error",error))

    }
    function mostrarCategorias(categorias=[]){
     categorias.forEach(Element=>{
       const option=document.createElement('OPTION')
       option.value=Element.strCategory
       option.textContent=Element.strCategory

        seleccionDeAlimentos.appendChild(option)
     })

    }
    function selecionarCategoria(e){
        const url=`https://www.themealdb.com/api/json/v1/1/filter.php?c=${e.target.value}`
        fetch(url)
            .then(response=>{
                if(!response.ok){
                    throw("hubo un error")

                }
                return response.json()
            }
            )
            .then(dato=>{
             mostrarPreparación(dato.meals)
            })

    }
    function mostrarPreparación(preparación=[]){
        limpiarHtml()
       preparación.forEach(elemento=>{
        const {idMeal,strMeal,strMealThumb}=elemento
        const div = document.createElement('div');
        const img = document.createElement('img');
        const parrafo = document.createElement('p');
        const boton = document.createElement('button');

        // Configurar los atributos y contenido de los elementos
        img.src = strMealThumb ?? elemento.imagen;
        img.style.width = '100%';
        parrafo.textContent =strMeal ?? elemento.titulo;
        boton.textContent = 'Ver receta';
        boton.onclick=function(){
          
            conectar(elemento)
        }

        // Agregar los elementos hijos al div
        div.appendChild(img);
        div.appendChild(parrafo);
        div.appendChild(boton);

        // Agregar el div al contenedor principal
        selecciondePreparación.appendChild(div);

       })


    }

    function limpiarHtml(){
        while(selecciondePreparación.firstChild){
            selecciondePreparación.removeChild(selecciondePreparación.firstChild)

        }

    }
    //conectamos para el modal
    function conectar(elmento){
        const {idMeal,strMeal,strMealThumb}=elmento

        btnSave.classList.toggle("show", validarLocalStorage(idMeal ?? elmento.id));
        btnSave.textContent = validarLocalStorage(idMeal ?? elmento.id) ? "Eliminar Favorito" : "Guardar Favorito";
        
        modal.classList.add("show")
        btonClose.onclick=function(){
         
        remover(modal)
        }
         title.textContent=strMeal ?? elmento.titulo
         imagenModal.src=strMealThumb ?? elmento.imagen

    const url=`https://themealdb.com/api/json/v1/1/lookup.php?i=${idMeal ?? elmento.id}`
     fetch(url)
     .then(response=>{
        if(!response.ok){
            throw("hubo un error al conectar a la base de datos")
        }
        return response.json()
     })
     .then(dato=>{
        const datos=dato.meals[0]
       
        consumirDatos(datos,strMeal)
   
     })
     function remover(elemento){
        elemento.classList.remove('show')
      
    }

    }


    function consumirDatos(elemento,titulo){ 
     
        descripcionModal.textContent=elemento[`strInstructions`]
      
        for (let index = 1; index <= 20; index++) {
            if(elemento[`strIngredient${index}`]){
                const intruccionesRecetas=document.createElement('DIV')
                intruccionesRecetas.classList.add('instruction')
                intruccionesRecetas.textContent=`${elemento[`strIngredient${index}`]} - ${elemento[`strMeasure${index}`]}`
                scrollModal.appendChild(intruccionesRecetas)
            }
            
        }

       btnSave.onclick=function(){
        const esFavorito=btnSave.classList.toggle("show")
        console.log(esFavorito)
        bannerGuardado.classList.add("show")
        btnSave.textContent=esFavorito ? "Eliminar Favorito":"Guardar favorito"
        bannerContenido.textContent = esFavorito ? "Agregado correctamente" :"Eliminado correctamente"

        if(validarLocalStorage(elemento.idMeal)){
          eliminarFavorito(elemento.idMeal)
          setTimeout(() => {
            bannerGuardado.classList.remove('show')
        }, 3000);
          return
        }

        if(!validarLocalStorage(elemento.idMeal)){
            
            agregarFavorito({id:elemento.idMeal,
                titulo,
                imagen:elemento.strMealThumb});
        }
        setTimeout(() => {
            bannerGuardado.classList.remove('show')
        }, 3000);
     
       } 
        
}
function agregarFavorito(elemento){

    
     agregamosLocalStorage(elemento)
  
}
function agregamosLocalStorage(receta){
  
    const favoritos=JSON.parse(localStorage.getItem('favoritos')) ??[]
    localStorage.setItem('favoritos',JSON.stringify([...favoritos,receta]))

    
}
function validarLocalStorage(id){
    const favoritos=JSON.parse(localStorage.getItem('favoritos')) ?? []
    return favoritos.some(favorito=>favorito.id===id)
}
function eliminarFavorito(id){
    btnSave.classList.remove('show')
    btnSave.textContent="Guardar Favorito"
    
    const favoritos=JSON.parse(localStorage.getItem('favoritos')) ?? []
    const nuevoFavorito= favoritos.filter(favorito=>favorito.id!==id)
    localStorage.setItem('favoritos', JSON.stringify(nuevoFavorito))

    location.reload()
}

//creamos para los favoritos
function obtenerFavoritos(){
    const favoritos=JSON.parse(localStorage.getItem('favoritos'))??[];
    // console.log(favoritos)
    if(favoritos.length){
        mostrarPreparación(favoritos)
    }
    
}
}
document.addEventListener('DOMContentLoaded',inicarApP)
