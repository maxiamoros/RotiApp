const express = require('express');
const cors = require('cors');
require('dotenv').config();
const chatRoutes = require('./routes/chat.routes');
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/ia', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/categorias', require('./routes/categorias.routes'));
app.use('/api/insumos', require('./routes/insumos.routes'));
app.use('/api/productos', require('./routes/productos.routes'));
app.use('/api/ventas', require('./routes/ventas.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/uploads', express.static(require('path').join(__dirname, '../../uploads')));

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});
