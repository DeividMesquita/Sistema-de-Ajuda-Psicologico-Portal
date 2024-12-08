const controler = require("../controler/cadastroControler"); // Corrigido para 'controler'
const express = require("express");

const rotas = express.Router();

// Rota para obter todos os cadastros - pacientes e profissionais
rotas.get("/all", controler.findAllCad);

// Rota para buscar um cadastro pelo ID
rotas.get("/:id", controler.findCadById);

// Rota para adicionar um novo cadastro de paciente (usuário comum)
rotas.post("/add", controler.addNewCad);

// Rota para adicionar um novo cadastro de profissional (rota separada)
rotas.post("/profissional", controler.addNewProfissional);  // A rota de cadastro do profissional

// Rota para o login do profissional
rotas.post("/login", controler.loginProfissional);  // Rota correta para login


// Rota para atualizar um cadastro
rotas.patch("/:id", controler.updateCad);

// Rota para deletar um cadastro
rotas.delete("/:id", controler.deleteCad);

module.exports = rotas;
