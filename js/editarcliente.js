(function() {

    let idCliente;
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {

        conectarDB();

        //Actualizar registro

        formulario.addEventListener('submit', actualizarCliente);

        //Verificar id de url
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');
        if(idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 100);
        }

    });

    function obtenerCliente(id) {
        const transaction = DB.transaction(['crm'], 'readonly');
        const objectStore = transaction.objectStore('crm');

        const cliente = objectStore.openCursor();
        cliente.onsuccess = function(e) {
            const cursor = e.target.result;

            if(cursor) {
                console.log(cursor.value);
                if(cursor.value.id === Number(id)) {
                    llenarFormulario(cursor.value);
                }

            }
            cursor.continue();

        }
    }

    function llenarFormulario(datosCliente){
        console.log(datosCliente);
        const {nombre, email, telefono, empresa} = datosCliente;

        nombreInput.value = nombre;
        empresaInput.value = empresa;
        emailInput.value = email;
        telefonoInput.value = telefono;
    }


    function actualizarCliente(e) {
        e.preventDefault();

        if(nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        //Actualizar cliente

        const clienteActualizado = {
            nombre: nombreInput.value,
            email: empresaInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)
        }

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteActualizado);

        transaction.oncomplete = function() {
            imprimirAlerta('Editado correctamente');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }

        transaction.onerror = function() {
            imprimirAlerta('Hubo un error');
        }
    }
    
})();