const express = require("express");
const controler = require("../controler/cadastroControler");

const rotas = express.Router();

// Rotas específicas
rotas.post("/paciente", controler.addNewPaciente);
rotas.post("/profissional", controler.addNewProfissional);
rotas.post("/login", controler.login);
rotas.post("/logout", controler.logout);
rotas.patch("/atualizar-senha", controler.atualizarSenha);

// Rotas gerais
rotas.get("/all", controler.findAllCad);
rotas.get("/cpf/:cpf", controler.findCadByCpf); // Buscar por CPF
rotas.patch("/cpf/:cpf", controler.updateCadByCpf); // Atualizar por CPF
rotas.delete("/cpf/:cpf", controler.deleteCadByCpf); // Deletar por CPF

module.exports = rotas;
