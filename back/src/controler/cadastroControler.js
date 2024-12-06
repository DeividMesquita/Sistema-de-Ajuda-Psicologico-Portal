const cadastroModel = require("../model/cadastroModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const findAllCad = async (req, res) => {
    try {
        const allCad = await cadastroModel.find();
        res.status(200).json(allCad)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

const findCadById = async (req, res) => {
    try {
        const findCad = await cadastroModel.findById(req.params.id)
        res.status(200).json(findCad)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

const addNewCad = async (req, res) =>{
    try {
        const {nome, cpf, email, telefone, endereço, data_de_nascimento, crp, available, description} = req.body
        const newCad = new cadastroModel({nome, cpf, email, telefone, endereço, data_de_nascimento, crp, available, description})
        const savedCad = await newCad.save()
        res.status(201).json({message: "Sucesso!!novo usuario cadastrado", savedCad})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

const updateCad = async (req, res) =>{
    try {
        const {nome, cpf, email, telefone, endereço, data_de_nascimento, crp, available, description} = req.body
        const updatedCad = await cadastroModel.findByIdAndUpdate(
            req.params.id, {nome, cpf, email, telefone, endereço, data_de_nascimento, crp, available, description})
            res.status(200).json({message: "atualizado e salvo", updatedCad})
        
    } catch (error) {
       console.error(error)
       res.status(500).json({message:"não foi possivel atualizar o cadastro"}) 
    
    }
}

const deleteCad = async (req, res) =>{
    try {
    
        const authHeader = req.get("authorization")
        if (!authHeader) {
            return res.status(401).send("Atenção! Voçê esqueceu de adicionar o TOKEN!")
        }
        const token = authHeader.split(" ")[1]
    
        jwt.verify(token, SECRET, async function (err) {
            if (err) {
                return res.status(403).send("acesso não autorizado!! adicione o token correto")
            }
        const {id} = req.params
        const deletedCad = await cadastroModel.findByIdAndDelete(id)
        const message = `${deletedCad.id} foi deletado com sucesso.`
        res.status(200).json({message})
        })
    } catch (error) {
        console.error(error)
       res.status(500).json({message:"não foi possivel deletar o usuario"}) 
    
    }
}
module.exports = {
    findAllCad,
    findCadById,
    addNewCad,
    updateCad,
    deleteCad
}