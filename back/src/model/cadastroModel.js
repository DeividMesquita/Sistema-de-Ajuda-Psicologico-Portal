const mongoose = require("mongoose");

// Define o esquema de cadastro
const cadastroSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId(),
        },
        nome: {
            type: String,
            required: true,
        },
        cpf: {
            type: String, // O CPF será armazenado como String para permitir zeros à esquerda.
            required: true,
            unique: true, // Garante que o CPF será único.
        },
        email: {
            type: String,
            required: true,
            unique: true, // Garante que o e-mail será único.
            match: [/^\S+@\S+\.\S+$/, "Por favor, insira um e-mail válido."] // Validação de e-mail
        },
        telefone: {
            type: String, // O telefone será armazenado como String por convenção.
            required: true,
        },
        endereco: {
            type: String, // Corrigido para "endereco" sem acento.
            required: true,
        },
        data_de_nascimento: {
            type: Date,
            required: true,
        },
        crp: {
            type: String, // Somente profissionais terão o campo CRP preenchido.
            required: false,
        },
        available: {
            type: Boolean,
            required: true,
            default: true, // Todos os cadastros começam como "disponíveis".
        }
    },
    {
        versionKey: false, // Remove o campo __v que o Mongoose cria automaticamente.
    }
);

// Define o modelo com o nome "Cadastro"
const Cadastro = mongoose.model("Cadastro", cadastroSchema);

module.exports = Cadastro;
