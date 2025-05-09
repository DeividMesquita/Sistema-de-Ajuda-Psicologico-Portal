function handleSubmit(event) {
    event.preventDefault();

    // Coleta os dados do formulário
    const formData = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        endereco: document.getElementById('endereco').value,
        cep: document.getElementById('cep').value,
        data_de_nascimento: document.getElementById('dataNascimento').value,
        senha: document.getElementById('senha').value // Traduzindo 'password' para 'senha'
    };

    // Valida se os campos obrigatórios estão preenchidos
    if (!formData.nome || !formData.cpf || !formData.email || !formData.senha) {
        alert("Por favor, preencha todos os campos obrigatórios!");
        return;
    }

    // Valida se as senhas coincidem
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    if (!formData.senha || !confirmarSenha) {
        alert("Por favor, preencha a senha e a confirmação de senha.");
        return;
    }
    if (formData.senha !== confirmarSenha) {
        alert("As senhas não correspondem!");
        return;
    }

    // Envia os dados para o back-end via POST
    fetch("http://localhost:1285/sistema/cadastro/paciente", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Enviando os dados como JSON
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message); // Exibe a mensagem de sucesso ou erro
            } else {
                alert("Erro ao cadastrar paciente.");
            }
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Erro ao cadastrar paciente.");
        });
}
