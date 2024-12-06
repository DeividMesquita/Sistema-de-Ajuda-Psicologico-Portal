const mongoose = require ("mongoose")
const cadastroSchrema = new mongoose.Schema( 
{
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
       },
    
    nome:{
        type: String,
        required: true,
    },
    cpf: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    telefone: {
        type: Number,
        required: true,
    },
    endereço:{
        type: String,
        required: true,
    },
    data_de_nascimento: {
        type: Date,
        required: true,
    },
    crp:{
        type: String,
        required: false,
    },
    available: {
        type: Boolean,
        required: true,
    },
    description: {
        type: String,
        minLength: 10,
        maxLength: 500,
        default: "não informado."
    }
    
},
{
    versionKey: false
})
const cadastro = mongoose.model("CadastroModel", cadastroSchrema)
module.exports = cadastro  