document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault(); // Impede o envio tradicional do formulário

    // Captura os valores dos campos
    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const endereco = document.getElementById("endereco").value;
    const cep = document.getElementById("cep").value;
    const dataNascimento = document.getElementById("dataNascimento").value;
    const crp = document.getElementById("crp").value;
    const senha = document.getElementById("senha").value;

    // Verifica se as senhas coincidem
    const confirmarSenha = document.getElementById("confirmarSenha").value;
    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem.");
        return; // Impede o envio se as senhas não coincidirem
    }

    // Cria um objeto com os dados para enviar ao servidor
const profissionalData = {
    nome,
    cpf,
    email,
    telefone,
    endereco,
    cep,
    data_de_nascimento: dataNascimento, // Usar um nome igual ao do back-end
    crp,
    password: senha // Renomeando o campo para "password" ao enviá-lo ao back-end
};

// Log para verificar os dados antes de enviar
console.log(profissionalData);

// Envia os dados para o back-end via POST
fetch('/sistema/cadastro/profissional', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(profissionalData),
})
.then(response => response.json())
.then(data => {
    if (data.message) {
        alert(data.message);
    } else {
        alert("Erro ao cadastrar profissional.");
    }
})
.catch(error => {
    console.error('Erro:', error);
    alert("Houve um erro ao tentar cadastrar o profissional.");
});

});
