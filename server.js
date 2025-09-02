const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Servir archivos estáticos

// Array para almacenar contactos (en memoria)
let contacts = [];
let nextId = 1;

// Rutas

// Ruta principal - servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Obtener todos los contactos
app.get('/contacts', (req, res) => {
    res.json(contacts);
});

// Agregar un nuevo contacto
app.post('/contacts', (req, res) => {
    const { name, email, phone } = req.body;
    
    if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    const newContact = {
        id: nextId++,
        name,
        email,
        phone
    };
    
    contacts.push(newContact);
    res.status(201).json(newContact);
});

// Eliminar un contacto
app.delete('/contacts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = contacts.length;
    
    contacts = contacts.filter(contact => contact.id !== id);
    
    if (contacts.length === initialLength) {
        return res.status(404).json({ error: 'Contacto no encontrado' });
    }
    
    res.status(204).send();
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
