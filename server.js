const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());
app.use(express.static('public'));

// Array en memoria para almacenar contactos
let contacts = [];
let nextId = 1;

// Ruta principal - servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para obtener todos los contactos
app.get('/contacts', (req, res) => {
    res.json(contacts);
});

// Ruta para agregar un nuevo contacto
app.post('/contacts', (req, res) => {
    const { name, email, phone } = req.body;
    
    // Validación básica
    if (!name || !email || !phone) {
        return res.status(400).json({ 
            success: false, 
            message: 'Todos los campos son requeridos' 
        });
    }
    
    // Crear nuevo contacto
    const newContact = {
        id: nextId++,
        name,
        email,
        phone
    };
    
    // Agregar a la lista
    contacts.push(newContact);
    
    res.json({ 
        success: true, 
        message: 'Contacto agregado correctamente',
        contact: newContact
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
