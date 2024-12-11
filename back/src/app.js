require('dotenv').config({ path: '../.env' });  // Caminho correto para o arquivo .env
const express = require("express");
const cors = require("cors");
const { connect } = require("./database/dbConnect.js");
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Conectar ao MongoDB
connect();

// Serve os arquivos estáticos da pasta "front"
app.use(express.static(path.join(__dirname, '..', '..', 'front-end'))); // Serve toda a pasta "front"

// Rota principal (Login)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../front-end/login/index.html")); // Página de login
});

// Rota para acessar a página de Profissional
app.get("/profissional", (req, res) => {
  res.sendFile('C:/Users/Deividson Mesquita/Downloads/Sistema de Ajuda Psicologico Portal/front-end/Profissional/Profissional.html');
});



// Roteamento de outras rotas
const admRotas = require("./rotas/admRotas.js");
const cadastroRotas = require("./rotas/cadastroRotas.js");

app.use("/sistema/adm", admRotas);
app.use("/sistema/cadastro", cadastroRotas);

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger/swagger_output.json");
app.use("/minha-documentacao", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Configurar a porta
const PORT = process.env.PORT || 1285;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
