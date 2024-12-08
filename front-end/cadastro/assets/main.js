function handleSubmit(event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    // Coleta os dados do formulário
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const endereco = document.getElementById('endereco').value;
    const cep = document.getElementById('cep').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    // Cria o objeto de dados
    const formData = {
        nome,
        cpf,
        email,
        telefone,
        endereco,
        cep,
        data_de_nascimento: dataNascimento, // Alinhar o nome do campo com o modelo
        crp: "", // Se for opcional, pode deixar vazio ou definir conforme a necessidade
        senha,
        confirmarSenha
    };

    // Verifica se a senha e a confirmação de senha são iguais
    if (senha !== confirmarSenha) {
        alert("As senhas não correspondem!");
        return;
    }

    // Envia os dados para o servidor usando fetch
    fetch('http://localhost:1285/sistema/cadastro/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message); // Mostra a mensagem retornada pelo servidor
        } else {
            // Caso o cadastro tenha sido bem-sucedido
            alert("Cadastro realizado com sucesso!");
            window.location.href = "/login/index.html"; // Redireciona para a página de login
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert("Ocorreu um erro ao enviar os dados!");
    });
}