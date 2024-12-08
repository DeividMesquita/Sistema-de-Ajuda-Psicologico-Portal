const cadastroModel = require("../model/cadastroModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

// Função para validar CPF
const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remover caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false; // Verifica se o CPF é inválido (ex.: 111.111.111-11)
    }

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.charAt(i - 1)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.charAt(i - 1)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
};

// Função para listar todos os cadastros
const findAllCad = async (req, res) => {
    try {
        const allCad = await cadastroModel.find();
        res.status(200).json(allCad);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Função para buscar cadastro por ID
const findCadById = async (req, res) => {
    try {
        const findCad = await cadastroModel.findById(req.params.id);
        if (!findCad) {
            return res.status(404).json({ message: "Cadastro não encontrado!" });
        }
        res.status(200).json(findCad);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Função para adicionar um novo cadastro
const addNewCad = async (req, res) => {
    try {
        const {
            nome,
            cpf,
            email,
            telefone,
            endereço,
            data_de_nascimento,
            crp,
            available = true, // Valor padrão
        } = req.body;

        // Validações dos campos obrigatórios
        if (!nome || !cpf || !email || !telefone || !endereço || !data_de_nascimento) {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios!" });
        }

        // Validação de CPF
        if (!validarCPF(cpf)) {
            return res.status(400).json({ message: "CPF inválido!" });
        }

        // Validação de e-mail
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "E-mail inválido!" });
        }

        // Verificar se CPF ou e-mail já existem
        const usuarioExistente = await cadastroModel.findOne({ $or: [{ cpf }, { email }] });
        if (usuarioExistente) {
            return res.status(400).json({ message: "CPF ou e-mail já estão cadastrados!" });
        }

        // Definir tipo de cadastro (Profissional ou Paciente)
        let tipoCadastro;
        if (crp) {
            tipoCadastro = "Profissional";
        } else {
            tipoCadastro = "Paciente";
        }

        // Criar novo registro
        const novoCadastro = new cadastroModel({
            nome,
            cpf,
            email,
            telefone,
            endereço,
            data_de_nascimento,
            crp: crp || null, // Apenas adiciona o CRP se estiver presente
            available,
        });

        // Salvar no banco de dados
        const savedCad = await novoCadastro.save();
        res.status(201).json({
            message: `${tipoCadastro} cadastrado com sucesso!`,
            savedCad
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erro ao cadastrar o usuário.",
            error: error.message
        });
    }
};

// Função para adicionar um novo cadastro de profissional
const addNewProfissional = async (req, res) => {
    try {
        // Log para verificar o que está sendo enviado pelo front-end
        console.log("Dados recebidos:", req.body);

        const {
            nome,
            cpf,
            email,
            telefone,
            endereco, // Corrigido para "endereco"
            data_de_nascimento,
            crp,
            available = true
        } = req.body;

        // Verificando os campos individuais
        console.log("Campos recebidos:", {
            nome,
            cpf,
            email,
            telefone,
            endereco,
            data_de_nascimento,
            crp
        });

        // Verificar campos obrigatórios
        if (!nome || !cpf || !email || !telefone || !endereco || !data_de_nascimento) {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios!" });
        }

        // Validação de CPF
        if (!validarCPF(cpf)) {
            return res.status(400).json({ message: "CPF inválido!" });
        }

        // Verificar duplicidade (CPF ou e-mail)
        const usuarioExistente = await cadastroModel.findOne({ $or: [{ cpf }, { email }] });
        if (usuarioExistente) {
            return res.status(400).json({ message: "CPF ou e-mail já estão cadastrados!" });
        }

        // Criar novo cadastro
        const novoCadastro = new cadastroModel({
            nome,
            cpf,
            email,
            telefone,
            endereco,
            data_de_nascimento,
            crp: crp || null,
            available,
        });

        const savedCadastro = await novoCadastro.save();
        return res.status(201).json({ message: "Cadastro realizado com sucesso!", savedCadastro });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao cadastrar.", error: error.message });
    }
};

// Função para login, tanto para profissionais quanto pacientes
const login = async (req, res) => {
    try {
        const { cpf, password } = req.body;

        // Verificar se o CPF existe no banco de dados
        const usuario = await cadastroModel.findOne({ cpf });
        if (!usuario) {
            return res.status(400).json({ message: "Usuário não encontrado!" });
        }

        // Verificar a senha usando bcrypt
        const senhaValida = await bcrypt.compare(password, usuario.senha);
        if (!senhaValida) {
            return res.status(400).json({ message: "Senha incorreta!" });
        }

        // Identificar o tipo de usuário (paciente ou profissional)
        const tipo = usuario.crp ? "profissional" : "paciente";

        // Gerar um token JWT
        const token = jwt.sign(
            { id: usuario._id, tipo }, // Inclui o tipo de usuário no payload
            process.env.SECRET,
            { expiresIn: '1h' }
        );

        // Retornar o token e tipo
        res.status(200).json({ message: "Login bem-sucedido!", token, tipo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no login", error: error.message });
    }
};



// Função para atualizar cadastro
const updateCad = async (req, res) => {
    try {
        const { nome, cpf, email, telefone, endereço, data_de_nascimento, crp, available, description } = req.body;
        const updatedCad = await cadastroModel.findByIdAndUpdate(
            req.params.id,
            { nome, cpf, email, telefone, endereço, data_de_nascimento, crp, available, description },
            { new: true } // Retorna o objeto atualizado
        );

        if (!updatedCad) {
            return res.status(404).json({ message: "Cadastro não encontrado!" });
        }

        res.status(200).json({ message: "Cadastro atualizado com sucesso!", updatedCad });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar o cadastro" });
    }
};

// Função para deletar cadastro
const deleteCad = async (req, res) => {
    try {
        const authHeader = req.get("authorization");
        if (!authHeader) {
            return res.status(401).json({ message: "Token de autorização ausente." });
        }
        const token = authHeader.split(" ")[1];

        // Verificar se o token é válido
        jwt.verify(token, SECRET, async function (err) {
            if (err) {
                return res.status(403).json({ message: "Acesso não autorizado! Adicione o token correto." });
            }

            const { id } = req.params;
            const deletedCad = await cadastroModel.findByIdAndDelete(id);

            if (!deletedCad) {
                return res.status(404).json({ message: "Cadastro não encontrado!" });
            }

            res.status(200).json({ message: `Cadastro com ID ${id} foi deletado com sucesso.` });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao deletar o usuário" });
    }
};

module.exports = {
    findAllCad,
    findCadById,
    addNewCad,
    addNewProfissional,
    updateCad,
    deleteCad,
    login
};
