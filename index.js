const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

//crear server
const app = express();

//conectar db
connectDB();

//habilitar cors
app.use(cors());

//habilitar express.json
app.use(express.json({extended: true}));

//port app
const PORT = process.env.PORT || 4000;

//routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/proyectos', require('./routes/projects'));
app.use('/api/tareas', require('./routes/tasks'));

//run app
app.listen(PORT, () => {
    console.log(`El servidor esta funcionando con el puerto ${PORT}`);
});