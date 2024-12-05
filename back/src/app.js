require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("./database/dbConnect.js");

const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect();

const admRotas = require("./rotas/admRotas.js");
const cadastroRotas = require("./rotas/cadastroRotas.js");

app.use("/sistema/adm",admRotas);
app.use("/sistema/cadastro",cadastroRotas);

const swaggerUi = require("swagger-ui-express")
const swaggerFile = require("../swagger/swagger_output.json")
app.use("/minha-documentacao", swaggerUi.serve, swaggerUi.setup(swaggerFile))


module.exports = app;