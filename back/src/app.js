require('dotenv').config({ path: '../.env' }); // Configuração do arquivo .env
const express = require("express");
const cors = require("cors");
const { connect } = require("./database/dbConnect.js");
const path = require('path');
const nodemailer = require("nodemailer");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger/swagger_output.json");

const app = express(); // Inicializa o Express

// Middlewares
app.use(express.json());
app.use(cors());

// Conectar ao MongoDB
connect();

// Configuração do Nodemailer
const smtp = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Porta 587 requer secure: false
  auth: {
    user: process.env.EMAIL_USER, // Variável de ambiente para o e-mail
    pass: process.env.EMAIL_PASS  // Variável de ambiente para a senha
  }
});

// Rota para envio de e-mails
app.post("/send-email", async (req, res) => {
  const { nome, data, hora } = req.body;

  const emailContent = `
  <p>Olá ${nome},</p>
  <p>Você tem uma sessão agendada:</p>
  <p><strong>Data:</strong> ${data}<br>
  <strong>Horário:</strong> ${hora}</p>
  <p><strong>Local:</strong> Cuca Pici</p>
  <p><strong>Link para a videoconferência:</strong> <a href="https://meet.google.com/aya-uutz-wup">https://meet.google.com/aya-uutz-wup</a></p>
  <p>Esperamos por você!</p>
`;

  const configEmail = {
    from: process.env.EMAIL_USER,
    to: "sappcucapici@gmail.com",
    subject: "Lembrete de Sessão - SAPP",
    html: emailContent,
  };

  try {
    await smtp.sendMail(configEmail);
    res.status(200).json({ message: "E-mail enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    res.status(500).json({ message: "Erro ao enviar e-mail.", error });
  }
});

app.post("/send-doubt-email", async (req, res) => {
  const { subject, body } = req.body;

  const configEmail = {
    from: process.env.EMAIL_USER,
    to: "sappcucapici@gmail.com",  // E-mail do destinatário
    subject: subject,
    text: body,  // Corpo do e-mail
  };

  try {
    await smtp.sendMail(configEmail);
    res.status(200).json({ message: "E-mail de dúvida enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    res.status(500).json({ message: "Erro ao enviar e-mail de dúvida.", error });
  }
});

// Serve os arquivos estáticos da pasta "front"
app.use(express.static(path.join(__dirname, '..', '..', 'front-end')));

// Rota principal (Login)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../front-end/login/index.html"));
});

// Rota para acessar a página de Profissional
app.get("/profissional", (req, res) => {
  res.sendFile('C:/Users/Deividson Mesquita/Downloads/Sistema de Ajuda Psicologico Portal/front-end/Profissional/Profissional.html');
});

// Roteamento de outras rotas
const admRotas = require("./rotas/admRotas.js");
const cadastroRotas = require("./rotas/cadastroRotas.js");

app.use("/sistema/adm", admRotas);
app.use("/sistema/cadastro", cadastroRotas);

// Documentação Swagger
app.use("/minha-documentacao", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Configurar a porta
const PORT = process.env.PORT || 1285;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;