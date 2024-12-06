# portalApoioPscologico
Um sistema inovador para oferecer suporte psicológico contínuo, com um foco especial em comunidades periféricas e minorias, além de proporcionar uma experiência prática valiosa para estudantes de psicologia.

#### **Para os cadastros**
_________________________________________

✔️ Cadastrar novos usuários.

✔️ Listar todos os cadastros.

✔️ Login adicionando usuario e senha.

✔️ Remover um cadastro específico pelo ID no banco de dados.

________________________________________
### 🏗️ **Arquitetura MVC**
________________________________________

```
  📁 portalApoioPscologico 
  📁back  
  |       
  |-  📁 node_modules
  |-  📁 Swagger    
  |         |- 📄 swagger_output.json   
  |-  📁 src  
  |    |- 📁 database  
  |         |- 📄 bdConnect.js    
  |    |- 📁 controler   
            |- 📄 admController.js 
  |         |- 📄 cadastroController.js     
  |    |- 📁 model 
            |- 📄 cadastroModel.js
  |         |- 📄 admModel.js  
  |    |- 📁 rotas 
            |- 📄 admRotas.js
  |         |- 📄 cadastroRotas.js     
  |         
  |    |- 📄 app.js   
  |           
  |-  📄 .env
  |-  📄 .env.example 
  |-  📄 .gitignore 
  |-  📄 package-lock.json   
  |-  📄 pakage.json 
  |-  📄 README.md 
  |-  📄 server.js
  |-  📄 Swagger.js
  |-  📁 material    
  ```
<br>

  ### 📦 **Dependências e Tecnologias**

<br>

**Base do projeto**
______________________________
```
Controle de versões: 
Git/GitHub

Editor de código - IDE:
VSCode

Desenvolver o back-end em Javascript:
Nodejs
```
 
**Instalações iniciais**
_______________________________________

```
Package.json em JS:
npm init -y

Express, cors e node_modules:
npm i express cors
versão
├── express@4.18.2
├── cors@2.8.5

Nodemon:
npm i -D nodemon
versão
├── nodemon@3.0.1
```

**Banco de dados**
___________________________________________________
```
Mongoose:
npm i mongoose
versão
├── mongoose@7.3.2
```

**Autententicação**
________________________________________

```
Jwt:
npm install jsonwebtoken -- save
versão
├── jsonwebtoken@9.0.1

Bcrypt:
npm install bcrypt -- save
versão
├── bcrypt@5.1.0
```
**Variaveis de ambiente**
____________________________________________________
```
Dotenv:
npm install dotenv-safe -- save
versão
├── dotenv@16.3.1
```

**Testes**
____________________________________________________
```
Jest:
npm install --save jest
versão
├── jest@29.6.1
```

**Documentação**
______________________________________________________
```
Swagger:
npm i swagger-autogen swagger-ui-express
versão
├── swagger-autogen@2.23.5
└── swagger-ui-express@5.0.0
```
<br>

## 🔒 **Variáveis de Ambiente**

<br>

*Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env*
```
`PORT=NUMERO_PORTA`    
`DATABASE_URI=CONEXÃO_COM_MONGO_SEM_ASPAS` 
`SECRET=CHAVE_HASH_SEM_ESPAÇO`
```
<br>

### 📌 **Rotas - EndPoint**

<br>
### 📚 **Documentação da API**
________________________________________________________________________________

📝[Swagger](https://portalApoioPscologico.onrender.com/minha-documentacao/)

📝[Render](https://portalapoiopscologico.onrender.com/minha-documentacao/)

### ✨ **Instalação e Contribuição no projeto** 
________________________________________________________________
1. Faça um **fork** do projeto.
2. Realize o clone do projeto através do `git clone <link_do_fork_do_repositorio>`
3. Crie uma nova branch com as suas alterações: `git checkout -b minha-branch`
4. Instale as dependências necessárias à execução da API através do comando `npm install`
5. Salve as alterações e crie uma mensagem de commit contando o que você fez: `git commit -m "feature: Minha contribuição"`
6. Envie as suas alterações: `git push origin minha-branch`

<br>

### 🗺️ **Referências**
_________________________________________________________
- [Emojis](https://emojipedia.org/)
---------------------------------------------------------

### ❤️ Agradecimentos