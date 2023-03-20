/*Creacion de un carrito de compras*/

//Creacion de las variables
const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content;
const tempalteFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment()
let carrito = {}
//Agregamos eventos de funcionalidad crud
document.addEventListener('DOMContentLoaded', e =>{fetchdata()});
cards.addEventListener('click',e =>{addCarrito(e)});
items.addEventListener('click',e =>{btnAumentarDisminuir(e)})

/*Iniciamos la funcion traer datos de una url o una api propia*/
const fetchdata = async () =>{
    const res = await fetch('api.json');
    const data = await res.json();
    pintarCards(data);
}

/*Mostrar Productos*/
const pintarCards = data => {
    data.forEach(item => {
        templateCard.querySelector('h5').textContent = item.title
        templateCard.querySelector('p').textContent = item.precio
        templateCard.querySelector('button').dataset.id = item.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

/*Agregar Productos*/
const addCarrito = e =>{
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement);
        console.log('Carrito agregado');
    }
    e.stopPropagation();
};

/*Enviamos Productos*/
const setCarrito = item =>{
    const producto ={
        title: item.querySelector('h5').textContent,
        precio: item.querySelector('p').textContent,
        id: item.querySelector('button').dataset.id,
        cantidad:1 
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad +1
    }
    carrito[producto.id] = {...producto};
    pintarCarrito();
}

/*Mostrar Carrito de Compras*/
const pintarCarrito = () =>{
    items.innerHTML = ''
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad
        
        //botones
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);
    localStorage.setItem('carrito', JSON.stringify(carrito))
    pintarFooter();
}

/*Mostramos el total de productos en el footer*/
const pintarFooter = () =>{
    footer.innerHTML = '';
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Su carrito de compras esta vacio</th>
        `
        return
    }
    /*Suma cantidad y Sumar totales*/
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)

    tempalteFooter.querySelectorAll('td')[0].textContent = nCantidad;
    tempalteFooter.querySelectorAll('span').textContent = nPrecio;

    const clone = tempalteFooter.cloneNode(true);
    fragment.appendChild(clone);

    footer.appendChild(fragment);

    const boton = document.querySelector('#vaciar-carrito');
    boton.addEventListener('click',() =>{
        carrito = {}
        pintarCarrito();
    })
}

const btnAumentarDisminuir = e => {
    // console.log(e.target.classList.contains('btn-info'))
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        pintarCarrito()
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        pintarCarrito()
    }
    e.stopPropagation()
}
















