const selectCriptomoneda = document.querySelector('#criptomoneda')
const selectMoneda = document.querySelector('#moneda')
const formulario = document.querySelector('#formulario')
const resultado = document.querySelector('#resultado')

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

const obtenerCriptomonedas = criptomonedas => new Promise(resolve => resolve(criptomonedas))

window.addEventListener("DOMContentLoaded", () => {
    consultarCriptomonedas()
    selectCriptomoneda.addEventListener('change', registrarDato)
    selectMoneda.addEventListener('change', registrarDato)
    formulario.addEventListener('submit', validarFormulario)
})

function consultarCriptomonedas() {

    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => mostrarCriptomonedas(criptomonedas))
}

function mostrarCriptomonedas(criptomonedas) {

    criptomonedas.forEach(criptomoneda => {
        const { Name, FullName } = criptomoneda.CoinInfo
        const option = document.createElement('OPTION')
        option.value = Name
        option.textContent = FullName
        selectCriptomoneda.appendChild(option)
    });

}

function registrarDato(e) {
    objBusqueda[e.target.name] = e.target.value
}

function validarFormulario(e) {
    e.preventDefault()

    const { moneda, criptomoneda } = objBusqueda

    if (moneda === "" || criptomoneda === "") {

        mostarAlertar('Todos los campos son obligatorios')

        return
    }

    cotizarCriptomoneda()

}

function mostarAlertar(mensaje) {

    const alertaPrevia = document.querySelector('.text-red-500')

    if (!alertaPrevia) {
        const alerta = document.createElement('DIV')
        alerta.classList.add('bg-red-100', 'text-red-500', 'border', 'border-red-400', 'rounded', 'py-2', 'text-center')
        alerta.textContent = mensaje

        formulario.appendChild(alerta)

        setTimeout(() => {
            alerta.remove()
        }, 3000);
    }
    

}

function cotizarCriptomoneda() {

    const { moneda, criptomoneda } = objBusqueda

    spinner()
    
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado=>criptomonedaHTML(resultado.DISPLAY[criptomoneda][moneda]))
}

function criptomonedaHTML(criptomoneda) {

    limpiarHtml()

    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = criptomoneda
    const precio = document.createElement('P')
    precio.classList.add('text-3xl')
    precio.innerHTML = `El precio es:<span>${PRICE}</span>`

    const precioAlto = document.createElement('P')
    precioAlto.classList.add('text-xl', 'mt-5')
    precioAlto.innerHTML = `El precio mas alto es: <span>${HIGHDAY}</span>`
    
    const precioBajo = document.createElement('P')
    precioBajo.classList.add('text-xl', 'mt-5')
    precioBajo.innerHTML = `El precio mas bajo es: <span>${LOWDAY}</span>`

    const ultimasHoras = document.createElement('P')
    ultimasHoras.classList.add('text-xl', 'mt-5')
    ultimasHoras.innerHTML = `Variación en las ultimas 24 horas es: <span>${CHANGEPCT24HOUR}%</span>`

    const ultimaActualizacion = document.createElement('P')
    ultimaActualizacion.classList.add('text-xl', 'mt-5')
    ultimaActualizacion.innerHTML = `Ultima actualización es: <span>${LASTUPDATE}</span>`

    resultado.appendChild(precio)
    resultado.appendChild(precioAlto)
    resultado.appendChild(precioBajo)
    resultado.appendChild(ultimasHoras)
    resultado.appendChild(ultimaActualizacion)
    
}

function limpiarHtml() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}

function spinner() {

    limpiarHtml()

    const spinner = document.createElement('DIV')
    spinner.classList.add("sk-chase")
    spinner.innerHTML = 
                        `
                            <div class="sk-chase-dot"></div>
                            <div class="sk-chase-dot"></div>
                            <div class="sk-chase-dot"></div>
                            <div class="sk-chase-dot"></div>
                            <div class="sk-chase-dot"></div>
                            <div class="sk-chase-dot"></div>
                        `

    resultado.appendChild(spinner)
}