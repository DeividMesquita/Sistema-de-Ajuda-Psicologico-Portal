const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const cadastroSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    usuario: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    cpf: {
      type: String,
      required: true,  // CPF é obrigatório
      unique: true,    // CPF precisa ser único
    },
    senha: {
      type: String,
      required: true,
    },
    cadastro: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cadastro",
    },
  },
  {
    versionKey: false,
  }
);

// Criptografando a senha antes de salvar no banco
cadastroSchema.pre("save", async function (next) {
  if (!this.isModified("senha")) return next(); // Só criptografa se a senha foi modificada
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

const CadastroAdm = mongoose.model("CadastroAdm", cadastroSchema);
module.exports = CadastroAdm;
