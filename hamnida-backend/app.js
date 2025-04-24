const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const userRoutes = require('./routes/user.routes');
const serviceRoutes = require('./routes/service.routes');
const agendamientoRoutes = require('./routes/agendamiento.routes');

const app = express();

// Conexión BD
connectDB();

// Middleware de CORS SOLO para tu frontend
app.use(cors({
  origin: 'https://eduartiba.github.io'
}));

app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  res.send('API Hamnida Technology funcionando');
});
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/agendamientos', agendamientoRoutes);

module.exports = app;
