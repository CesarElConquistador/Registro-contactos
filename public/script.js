// URL base de la API (nuestro servidor Express)
const API_BASE_URL = 'http://localhost:3000';

// Elementos del DOM
const contactForm = document.getElementById('contactForm');
const contactsTable = document.getElementById('contactsTable');
const emptyMessage = document.getElementById('emptyMessage');

// Función para obtener y mostrar los contactos
async function loadContacts() {
    try {
        const response = await fetch(`${API_BASE_URL}/contacts`);
        const contacts = await response.json();
        renderContacts(contacts);
    } catch (error) {
        console.error('Error al cargar contactos:', error);
        // Mostrar mensaje de error al usuario
        contactsTable.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-danger">
                    Error al cargar los contactos. Asegúrate de que el servidor esté ejecutándose.
                </td>
            </tr>
        `;
    }
}

// Función para mostrar los contactos en la tabla
function renderContacts(contacts) {
    if (contacts.length === 0) {
        contactsTable.innerHTML = '';
        emptyMessage.style.display = 'block';
        return;
    }
    
    emptyMessage.style.display = 'none';
    contactsTable.innerHTML = contacts.map(contact => `
        <tr>
            <td>${contact.id}</td>
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-danger" onclick="deleteContact(${contact.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        </tr>
    `).join('');
}

// Función para agregar un contacto
async function addContact(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    // Validación simple
    if (!name || !email || !phone) {
        alert('Por favor, complete todos los campos');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phone })
        });
        
        if (response.ok) {
            // Recargar la lista de contactos
            loadContacts();
            // Limpiar el formulario
            contactForm.reset();
        } else {
            alert('Error al agregar el contacto');
        }
    } catch (error) {
        console.error('Error al agregar contacto:', error);
        alert('Error de conexión con el servidor');
    }
}

// Función para eliminar un contacto
async function deleteContact(id) {
    if (confirm('¿Está seguro de que desea eliminar este contacto?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                // Recargar la lista de contactos
                loadContacts();
            } else {
                alert('Error al eliminar el contacto');
            }
        } catch (error) {
            console.error('Error al eliminar contacto:', error);
            alert('Error de conexión con el servidor');
        }
    }
}

// Función para inicializar la aplicación
function initApp() {
    // Cargar contactos al iniciar
    loadContacts();
    
    // Agregar event listener al formulario
    contactForm.addEventListener('submit', addContact);
}

// Inicializar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
