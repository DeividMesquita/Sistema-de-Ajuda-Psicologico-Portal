const Cadastro = require("../model/cadastroModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Obter todos os cadastros
const findAllCad = async (req, res) => {
    try {
        const cadastros = await Cadastro.find();
        res.status(200).json(cadastros);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar cadastros.", error });
    }
};

// Obter cadastro por CPF
const findCadByCpf = async (req, res) => {
    try {
        const { cpf } = req.params;
        const cadastro = await Cadastro.findOne({ cpf });
        if (!cadastro) {
            return res.status(404).json({ message: "Cadastro não encontrado." });
        }
        res.status(200).json(cadastro);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar cadastro.", error });
    }
};

// Adicionar novo paciente
const addNewPaciente = async (req, res) => {
    try {
        // Extrair os dados do corpo da requisição
        const { nome, cpf, email, telefone, endereco, cep, data_de_nascimento, senha } = req.body;

        // Verificar se todos os campos obrigatórios foram preenchidos
        if (!nome || !cpf || !email || !telefone || !endereco || !cep || !data_de_nascimento || !senha) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios." });
        }

        // Verificar se o CPF já está cadastrado
        const cpfExistente = await Cadastro.findOne({ cpf });
        if (cpfExistente) {
            return res.status(400).json({ message: "CPF já cadastrado." });
        }

        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Criar um novo documento do paciente
        const novoPaciente = new Cadastro({
            nome,
            cpf,
            email,
            telefone,
            endereco,
            cep,
            data_de_nascimento,
            senha: hashedPassword,
        });

        // Salvar o paciente no banco de dados
        const pacienteSalvo = await novoPaciente.save();

        // Retornar sucesso
        res.status(201).json({ message: "Paciente cadastrado com sucesso!", paciente: pacienteSalvo });
    } catch (error) {
        // Log para depuração
        console.error("Erro ao cadastrar paciente:", error);

        // Retornar erro genérico ao cliente
        res.status(500).json({ message: "Erro ao cadastrar paciente. Tente novamente mais tarde.", error: error.message });
    }
};

// Adicionar novo profissional
const addNewProfissional = async (req, res) => {
    try {
        const { nome, cpf, email, telefone, endereco, cep, data_de_nascimento, crp, senha } = req.body;

        const hashedPassword = await bcrypt.hash(senha, 10);
        const novoProfissional = new Cadastro({
            nome,
            cpf,
            email,
            telefone,
            endereco,
            cep,
            data_de_nascimento,
            crp,
            senha: hashedPassword,
        });

        const profissionalSalvo = await novoProfissional.save();
        res.status(201).json({ message: "Profissional cadastrado com sucesso!", profissionalSalvo });
    } catch (error) {
        res.status(500).json({ message: "Erro ao cadastrar profissional.", error });
    }
};

// Login para pacientes e profissionais
const login = async (req, res) => {
    try {
        const { cpf, senha } = req.body;
        console.log('Dados recebidos:', { cpf, senha });

        // Verifica se o CPF existe no banco
        const usuario = await Cadastro.findOne({ cpf });

        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        // Verifica se a senha está correta
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ message: "Senha inválida." });
        }

        // Determina o tipo de usuário (profissional ou paciente)
        const tipo = usuario.crp ? "profissional" : "paciente";

        // Gera o token de autenticação
        const token = jwt.sign(
            { id: usuario._id, tipo },
            process.env.SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login realizado com sucesso!", token, tipo });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ message: "Erro ao realizar login.", error: error.message });
    }
};

// Atualizar cadastro
const updateCadByCpf = async (req, res) => {
    try {
        const { cpf } = req.params;
        const updates = req.body;

        if (updates.senha) {
            updates.senha = await bcrypt.hash(updates.senha, 10);
        }

        const cadastroAtualizado = await Cadastro.findOneAndUpdate({ cpf }, updates, { new: true });
        if (!cadastroAtualizado) {
            return res.status(404).json({ message: "Cadastro não encontrado." });
        }
        res.status(200).json({ message: "Cadastro atualizado com sucesso!", cadastroAtualizado });
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar cadastro.", error });
    }
};

// Deletar cadastro
const deleteCadByCpf = async (req, res) => {
    try {
        const { cpf } = req.params;
        const cadastroDeletado = await Cadastro.findOneAndDelete({ cpf });

        if (!cadastroDeletado) {
            return res.status(404).json({ message: "Cadastro não encontrado." });
        }
        res.status(200).json({ message: "Cadastro deletado com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar cadastro.", error });
    }
};

module.exports = {
    findAllCad,
    findCadByCpf,
    addNewPaciente,
    addNewProfissional,
    login,
    updateCadByCpf,
    deleteCadByCpf,
};