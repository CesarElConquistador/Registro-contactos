document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const contactsTable = document.getElementById('contactsTable');
    
    // Cargar contactos existentes al iniciar
    loadContacts();
    
    // Manejar envío del formulario
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        
        // Validación básica
        if (!name || !email || !phone) {
            alert('Por favor, complete todos los campos');
            return;
        }
        
        // Enviar datos al servidor
        fetch('/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phone })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Limpiar formulario
                contactForm.reset();
                // Recargar la tabla de contactos
                loadContacts();
            } else {
                alert('Error al guardar el contacto: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        });
    });
    
    // Función para cargar contactos desde el servidor
    function loadContacts() {
        fetch('/contacts')
            .then(response => response.json())
            .then(contacts => {
                // Limpiar tabla
                contactsTable.innerHTML = '';
                
                // Agregar cada contacto a la tabla
                contacts.forEach(contact => {
                    const row = document.createElement('tr');
                    
                    row.innerHTML = `
                        <td>${contact.name}</td>
                        <td>${contact.email}</td>
                        <td>${contact.phone}</td>
                    `;
                    
                    contactsTable.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error al cargar contactos:', error);
            });
    }
});
