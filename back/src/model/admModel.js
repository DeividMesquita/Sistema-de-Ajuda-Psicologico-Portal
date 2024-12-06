const mongoose = require ("mongoose")
const cadastroSchrema = new mongoose.Schema( 
{
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
       },
    usuario:{
        type: String,   
       },
    email:{
        type: String,    
    },
    senha:{
        type:String,
    },
    cadastro: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cadastro"
    }
},
{
    versionKey: false
})
const cadastroadm = mongoose.model("Cadastro", cadastroSchrema)
module.exports = cadastroadm