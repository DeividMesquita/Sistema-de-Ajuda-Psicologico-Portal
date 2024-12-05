const controler = require("../controler/cadastroControler");
const express = require("express")

const rotas = express.Router();

rotas.get("/all", controler.findAllCad);
rotas.get("/:id", controler.findCadById);
rotas.post("/add", controler.addNewCad);
rotas.patch("/:id", controler.updateCad);
rotas.delete("/:id", controler.deleteCad);

module.exports = rotas;