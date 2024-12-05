const controler = require("../controler/admControler");
const express = require("express");

const rota = express.Router();

rota.get("/all", controler.findAllCadastro);
rota.post("/add", controler.addNewCadastro);
rota.delete("/:id", controler.deleteCadastro);
rota.post("/login", controler.login);

module.exports = rota