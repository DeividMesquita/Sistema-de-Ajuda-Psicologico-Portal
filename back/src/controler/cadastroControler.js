const Cadastro = require("../model/cadastroModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

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
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Cadastro Realizado com Sucesso',
        text: `Olá ${nome},\n\nSeu cadastro foi realizado com sucesso!\n\nAtenciosamente, Equipe.`,
    };

    try {
        console.log('Enviando e-mail para:', email);
        await transporter.sendMail(mailOptions);
        console.log('E-mail enviado com sucesso!');
    } catch (error) {
        console.error("Erro ao enviar o email:", error);
    }
};

// Adicionar novo paciente
const addNewPaciente = async (req, res) => {
    try {
        const { nome, cpf, email, telefone, endereco, cep, data_de_nascimento, senha } = req.body;
        const erroValidacao = validarCampos(req.body, ['nome', 'cpf', 'email', 'telefone', 'endereco', 'cep', 'data_de_nascimento', 'senha']);
        if (erroValidacao) {
            return res.status(400).json({ message: erroValidacao });
        }

        const cpfExistente = await Cadastro.findOne({ cpf });
        if (cpfExistente) {
            return res.status(400).json({ message: "CPF já cadastrado." });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);
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

        const pacienteSalvo = await novoPaciente.save();
        await enviarEmailCadastro(email, nome);

        res.status(201).json({ message: "Paciente cadastrado com sucesso!", paciente: pacienteSalvo });
    } catch (error) {
        console.error("Erro ao cadastrar paciente:", error);
        res.status(500).json({ message: "Erro ao cadastrar paciente. Tente novamente mais tarde.", error: error.message });
    }
};

// Adicionar novo profissional
const addNewProfissional = async (req, res) => {
    try {
        const { nome, cpf, email, telefone, endereco, cep, data_de_nascimento, crp, senha } = req.body;
        const erroValidacao = validarCampos(req.body, ['nome', 'cpf', 'email', 'telefone', 'endereco', 'cep', 'data_de_nascimento', 'senha', 'crp']);
        if (erroValidacao) {
            return res.status(400).json({ message: erroValidacao });
        }

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
        await enviarEmailCadastro(email, nome);

        res.status(201).json({ message: "Profissional cadastrado com sucesso!", profissionalSalvo });
    } catch (error) {
        console.error('Erro ao cadastrar profissional:', error);
        res.status(500).json({ message: "Erro ao cadastrar profissional.", error });
    }
};

// Login para pacientes e profissionais
const login = async (req, res) => {
    try {
        const { cpf, senha } = req.body;
        const usuario = await Cadastro.findOne({ cpf });

        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        // Adicionando logs para verificar as senhas
        console.log("Senha informada:", senha);  // Senha enviada no corpo da requisição
        console.log("Senha no banco de dados:", usuario.senha);  // Senha salva no banco de dados

        // Comparando as senhas
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        console.log("Senha válida:", senhaValida); // Verifique se a senha foi validada corretamente

        if (!senhaValida) {
            return res.status(401).json({ message: "Senha inválida." });
        }

        const tipo = usuario.crp ? "profissional" : "paciente";
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


// Logout
const logout = (req, res) => {
    console.log('Logout requisitado');
    try {
        res.status(200).json({ message: "Logout realizado com sucesso!" });
    } catch (error) {
        console.error("Erro no logout:", error);
        res.status(500).json({ message: "Erro ao realizar logout.", error: error.message });
    }
};


// Atualizar cadastro
const updateCadByCpf = async (req, res) => {
    try {
        const { cpf } = req.params;
        const updates = req.body;

        // Se a senha for fornecida, encriptá-la
        if (updates.senha) {
            updates.senha = await bcrypt.hash(updates.senha, 10);
        }

        // Atualiza o cadastro no banco de dados
        const cadastroAtualizado = await Cadastro.findOneAndUpdate({ cpf }, updates, { new: true });

        if (!cadastroAtualizado) {
            return res.status(404).json({ message: "Cadastro não encontrado." });
        }

        res.status(200).json({ message: "Cadastro atualizado com sucesso!", cadastroAtualizado });
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar cadastro.", error });
    }
};

const atualizarSenha = async (req, res) => {
    const { cpf, newPassword } = req.body; // Pegue os dados do corpo da requisição
  
    try {
      // Gerar o salt e criptografar a nova senha
      const saltRounds = 10;
      const senhaCriptografada = await bcrypt.hash(newPassword, saltRounds);
  
      // Aqui, faça a atualização no banco de dados, substituindo a senha antiga pela nova
      // Exemplo de um modelo fictício de paciente
      const paciente = await Cadastro.findOne({ cpf });
      if (!paciente) {
        return res.status(404).json({ message: "Cadastro não encontrado." });
      }
  
      paciente.senha = senhaCriptografada;  // Atualize a senha criptografada
      await paciente.save(); // Salve no banco de dados
  
      return res.status(200).json({ message: "Senha atualizada com sucesso!" });
  
    } catch (error) {
      console.error("Erro ao atualizar a senha:", error);
      return res.status(500).json({ message: "Erro ao atualizar a senha.", error: error.message });
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
    logout,
    updateCadByCpf,
    deleteCadByCpf,
    atualizarSenha
};
