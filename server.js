const express = require('express');
const cors = require('cors');
const authRoutes = require("./src/routes/auth");
const produtosRoutes = require("./src/routes/produtos");
const carrinhosRoutes = require("./src/routes/carrinhos");
const pedidosRoutes = require("./src/routes/pedidos");
const usersRoutes = require("./src/routes/users");
const path = require('path');
const bodyParser = require("body-parser");

const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-auth-token']
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/produtos', produtosRoutes);
app.use('/uploads', express.static(path.join(__dirname, './uploads')));
app.use('/carrinhos', carrinhosRoutes);
app.use('/pedidos', pedidosRoutes);
app.use('/users', usersRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
