(function() {
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        formulario.addEventListener('submit', validarCliente);
    });

    function validarCliente(e) {
        e.preventDefault();

        //inputs

        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if(nombre === '' || email === '' || telefono === '' || empresa === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
        }

        //Crear un objeto con la información

        //Crear un objeto utilizanod objectliteral echanced

        const cliente = {
            nombre,
            email,
            telefono,
            empresa,
            id : Date.now()
        }

        console.log(cliente);

        crearNuevoCliente(cliente);

    }

    function crearNuevoCliente(cliente) {
        const transaction = DB.transaction(['crm'], 'readwrite');

        const objectStore = transaction.objectStore('crm');

        objectStore.add(cliente);

        transaction.onerror = function() {
            imprimirAlerta('Hubo un error', 'error');
        }

        transaction.oncomplete = function() {
            imprimirAlerta('Cliente agregado');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }
    }

})();