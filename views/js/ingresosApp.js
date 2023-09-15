var url="http://localhost/PROYECTO/";
var proveedorId;

document.getElementById("agregarProductosModal").addEventListener("submit", function(event){
    event.preventDefault();

    const formulario = document.getElementById("agregarProductosModal");
    const formData = new FormData(formulario);
    const valores = formData.get("producto");
    const partes = valores.split('/');
    agregarProductoTabla(partes[0], partes[1], partes[2]);
})

document.getElementById("btnFinalizar").addEventListener("click", function(){
    var stocks = obtenerDatos();
})

function enviarFormulario(stocks) {
    const formData = new FormData();
    formData.append("stocks",stocks)
    const nombreCategoria = formData.get("nombreCategoria");
  
    fetch(url+"Categorias/Crear", {
      method: "POST",
      body: formData,
    })
    .then(response => {
      if (response.ok) { 
        return response.json();
      } else {
        throw new Error('Error en la respuesta del servidor: ${response.status} ${response.statusText}');
      }
    })
    .then(data => {
      console.log(data);
      mostrarNotificacion("Respuesta", data.Mensaje, data.Respuesta ? 'success' : 'error', 'OK');
      if(data.Respuesta) AgregarFila(data.Valor, nombreCategoria);
    })
    .catch(error => {
      console.error("Error al enviar el formulario:", error);
      alert("Error al enviar el formulario. Por favor, inténtalo de nuevo más tarde.");
    });
  }

document.getElementById("proveedoresSelect").addEventListener("change", function(){
    proveedorId = document.getElementById("proveedoresSelect").value;
    limpiarSelectProducto();
})

function limpiarSelectProducto(){
    const selectElement = document.getElementById("selectProducto");
    while (selectElement.firstChild) {
        selectElement.removeChild(selectElement.firstChild);
    }
}


document.getElementById("btnAgregarProducto").addEventListener("click", function(){
    solicitarProductos(proveedorId);
})

function solicitarProductos(id){
    const formData = new FormData();
    formData.append("id",id);
  
    fetch(url+"Ingresos/cargarProductos", {
      method: "POST",
      body: formData,
    })
    .then(response => {
      if (response.ok) { 
        return response.json();
      } else {
        throw new Error('Error en la respuesta del servidor: ${response.status} ${response.statusText}');
      }
    })
    .then(data => {
      console.log(data);
      
      if(data.Respuesta) llenarListProductos(data.Valor);
      else alert("Error al traer los productos del proveedor");
    })
    .catch(error => {
      console.error("Error al enviar el formulario:", error);
      alert("Error al enviar el formulario. Por favor, inténtalo de nuevo más tarde.");
    });
}

function llenarListProductos(productos){
    const selectElement = document.getElementById("selectProducto");
    productos.forEach(function(objeto){
        const nuevaOpcion = document.createElement("option");
        nuevaOpcion.value = objeto.id+'/'+objeto.nombre+'/'+objeto.codigo;
        nuevaOpcion.text = objeto.nombre;
        selectElement.appendChild(nuevaOpcion);
    })
}

function agregarProductoTabla(id, nombre, codigo){
    const tabla = document.getElementById("bodyTablaProductos");

    const newRow = document.createElement("tr");
    newRow.setAttribute("data-model", id);

    
    const celdaCodigo = document.createElement("td");
    celdaCodigo.textContent = codigo;
    newRow.appendChild(celdaCodigo);

    const celdaNombre = document.createElement("td");
    celdaNombre.textContent = nombre;
    newRow.appendChild(celdaNombre);

    const celdaCantidad = document.createElement("td");
    const inputCantidad = document.createElement("input");
    inputCantidad.type = "text";
    inputCantidad.setAttribute("cantidadOf", id);
    celdaCantidad.appendChild(inputCantidad);
    newRow.appendChild(celdaCantidad);

    const celdaCompra = document.createElement("td");
    const inputCompra = document.createElement("input");
    inputCompra.type = "text";
    inputCompra.setAttribute("compraOf", id);
    celdaCompra.appendChild(inputCompra);
    newRow.appendChild(celdaCompra);

    const celdaMinimo = document.createElement("td");
    const inputMinimo = document.createElement("input");
    inputMinimo.type = "text";
    inputMinimo.setAttribute("minimoOf", id);
    celdaMinimo.appendChild(inputMinimo);
    newRow.appendChild(celdaMinimo);

    const celdaVenta = document.createElement("td");
    const inputVenta = document.createElement("input");
    inputVenta.type = "text";
    inputVenta.setAttribute("ventaOf", id);
    celdaVenta.appendChild(inputVenta);
    newRow.appendChild(celdaVenta);

    tabla.appendChild(newRow);
}

function obtenerDatos(){
    const tbody = document.getElementById("bodyTablaProductos");
    const filas = tbody.getElementsByTagName("tr");
    var stocks = [];

    for (let i = 0; i < filas.length; i++) {
        var stock = {
            id:0,
            cantidad: 0,
            precioCompra : 0,
            precioVentaMinimo :0,
            precioVenta: 0
        }
        const dataModel = filas[i].getAttribute("data-model");
        stock.id = dataModel;
        
        const inputs = filas[i].getElementsByTagName("input");
        stock.cantidad = inputs[0].value;
        stock.precioCompra = inputs[1].value;
        stock.precioVentaMinimo = inputs[2].value;
        stock.precioVenta = inputs[3].value;
        
        
        stocks.push(stock);
    }

    return stock;
    
}