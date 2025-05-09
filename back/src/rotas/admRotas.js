const controler = require("../controler/admControler");
const express = require("express");

const rota = express.Router();

// Rota de login (não precisa de token, agora usa CPF em vez de email)
rota.post("/login", controler.login);

// Rota para adicionar um novo cadastro (não precisa de token)
rota.post("/add", controler.addNewCadastro);

// Rota para obter todos os cadastros - precisa de token
rota.get("/all", controler.verifyToken, controler.findAllCadastro);

// Rota para deletar um cadastro - precisa de token
rota.delete("/:id", controler.verifyToken, controler.deleteCadastro);

module.exports = rota;
