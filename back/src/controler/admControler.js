const Cadastros = require("../model/admModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

// Middleware para verificar o token
const verifyToken = (req, res, next) => {
    const authHeader = req.get("authorization");
    if (!authHeader) {
        return res.status(401).send("Atenção! Você esqueceu de adicionar o TOKEN!");
    }
    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send("Acesso não autorizado! Adicione o token correto.");
        }
        req.user = decoded; // Armazenar informações do usuário no request para uso posterior
        next();
    });
};

const findAllCadastro = async (req, res) => {
    try {
        const allCadastro = await Cadastros.find();
        res.status(200).json(allCadastro);
        console.log("Todos os cadastros disponíveis estão aqui:", allCadastro);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

const addNewCadastro = (req, res) => {
    try {
        const { usuario, email, cpf, senha } = req.body;
        const senhaComHash = bcrypt.hashSync(senha, 10);
        const cadastro = new Cadastros({ usuario, email, cpf, senha: senhaComHash });
        cadastro.save();
        res.status(201).json({ message: "Cadastro realizado com sucesso", cadastro });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteCadastro = async (req, res) => {
    try {
        const { id } = req.params;
        await Cadastros.findByIdAndDelete(id);
        const message = `O cadastro com id: ${id} foi deletado com sucesso!`;
        res.status(200).json({ message });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const login = async (req, res) => {
    const { cpf, senha } = req.body;

    // Validação básica dos campos
    if (!cpf || !senha) {
        return res.status(400).send("Por favor, forneça o CPF e a senha.");
    }

    try {
        // Procurando o usuário no banco pelo CPF
        const cadastro = await Cadastros.findOne({ cpf: cpf });

        if (!cadastro) {
            return res.status(404).send(`Não existe cadastro com o CPF ${cpf}!`);
        }

        // Comparando a senha informada com a armazenada
        const senhaValida = bcrypt.compareSync(senha, cadastro.senha);
        if (!senhaValida) {
            return res.status(403).send("Senha incorreta.");
        }

        // Gerando o token JWT com mais informações (id, cpf, nome de usuário, tipo, etc.)
        const token = jwt.sign(
            { id: cadastro._id, cpf: cadastro.cpf, usuario: cadastro.usuario, tipo: cadastro.tipo },
            SECRET,
            { expiresIn: "1h" } // Expira em 1 hora
        );

        // Retornando a resposta com o token e os dados do usuário
        return res.status(200).json({
            message: "Login bem-sucedido!",
            token: token,
            usuario: cadastro.usuario,
            cpf: cadastro.cpf,
            tipo: cadastro.tipo,  // Enviar tipo junto
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send("Erro no processo de login.");
    }
};

module.exports = {
    findAllCadastro,
    addNewCadastro,
    deleteCadastro,
    login,
    verifyToken,
};
