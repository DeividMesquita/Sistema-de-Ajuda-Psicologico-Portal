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

// Função para verificar campos obrigatórios
const validarCampos = (dados, camposObrigatorios) => {
    for (let campo of camposObrigatorios) {
        if (!dados[campo]) {
            return `Campo ${campo} é obrigatório.`;
        }
    }
    return null;
};

// Função para enviar email
const enviarEmailCadastro = async (email, nome) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Pode ser outro serviço de e-mail
        auth: {
            user: process.env.EMAIL_USER, // Seu e-mail
            pass: process.env.EMAIL_PASS, // Sua senha ou app password
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, 
        to: email,
        subject: 'Cadastro Realizado com Sucesso',
        text: `Olá ${nome},\n\nSeu cadastro foi realizado com sucesso!\n\nAtenciosamente, Equipe.`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Erro ao enviar o email:", error);
    }
};

// Adicionar novo paciente
// Adicionar novo paciente
const addNewPaciente = async (req, res) => {
    try {
        const { nome, cpf, email, telefone, endereco, cep, data_de_nascimento, senha } = req.body;
        
        // Validando campos obrigatórios
        const erroValidacao = validarCampos(req.body, ['nome', 'cpf', 'email', 'telefone', 'endereco', 'cep', 'data_de_nascimento', 'senha']);
        if (erroValidacao) {
            return res.status(400).json({ message: erroValidacao });
        }

        // Verificar se o CPF já está cadastrado
        const cpfExistente = await Cadastro.findOne({ cpf });
        if (cpfExistente) {
            return res.status(400).json({ message: "CPF já cadastrado." });
        }

        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Criar novo paciente
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

        // Salvar paciente
        const pacienteSalvo = await novoPaciente.save();
        
        // Enviar e-mail de sucesso
        await enviarEmailCadastro(email, nome);

        res.status(201).json({ message: "Paciente cadastrado com sucesso!", paciente: pacienteSalvo });
    } catch (error) {
        console.error("Erro ao cadastrar paciente:", error);
        res.status(500).json({ message: "Erro ao cadastrar paciente. Tente novamente mais tarde.", error: error.message });
    }
};

// Adicionar novo profissional
// Adicionar novo profissional
const addNewProfissional = async (req, res) => {
    try {
        const { nome, cpf, email, telefone, endereco, cep, data_de_nascimento, crp, senha } = req.body;

        const erroValidacao = validarCampos(req.body, ['nome', 'cpf', 'email', 'telefone', 'endereco', 'cep', 'data_de_nascimento', 'senha', 'crp']);
        if (erroValidacao) {
            return res.status(400).json({ message: erroValidacao });
        }

        // Criptografar senha
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

        // Enviar e-mail de sucesso
        await enviarEmailCadastro(email, nome);

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