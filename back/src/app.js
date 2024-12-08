require('dotenv').config({ path: '../.env' });  // Caminho correto para o arquivo .env
const express = require("express");
const cors = require("cors");
const { connect } = require("./database/dbConnect.js");
const path = require('path');  // Importando o módulo path

const app = express();
app.use(express.json());
app.use(cors());

// Conectar ao MongoDB
connect();

// Serve os arquivos estáticos da pasta "front-end"
app.use(express.static(path.join(__dirname, '..', '..', 'front-end'))); // Usando o path para garantir o caminho correto

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../front-end/login/index.html"));  // Usando o path também aqui
});app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../front-end/login/index.html"));  // Usando o path também aqui
});

// Roteamento
const admRotas = require("./rotas/admRotas.js");
const cadastroRotas = require("./rotas/cadastroRotas.js");

app.use("/sistema/adm", admRotas);
app.use("/sistema/cadastro", cadastroRotas);

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger/swagger_output.json");
app.use("/minha-documentacao", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Configurar a porta
const PORT = process.env.PORT || 1285; // A porta será 1285, ou a que você configurou no .env

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
