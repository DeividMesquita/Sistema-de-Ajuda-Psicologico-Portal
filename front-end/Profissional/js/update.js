// Função para carregar os dados do profissional logado
async function loadProfessionalData() {
    // Recupera o CPF do profissional logado do localStorage
    const cpf = localStorage.getItem('cpf'); // Ou utilize outro método para pegar o CPF
    console.log("CPF recuperado do localStorage:", cpf);

    if (!cpf) {
        alert('Profissional não está autenticado!');
        window.location.href = '/login.html'; // Redireciona para a página de login se não encontrar o CPF
        return;
    }

    // Faz a requisição para o backend com o CPF
    const response = await fetch(`/sistema/cadastro/cpf/${cpf}`);

    if (response.ok) {
        const professionalData = await response.json(); // Obtém os dados do profissional

        // Preenche os campos do formulário com os dados do profissional
        document.getElementById('nome').value = professionalData.nome;
        document.getElementById('cpf').value = professionalData.cpf;
        document.getElementById('email').value = professionalData.email;
        document.getElementById('telefone').value = professionalData.telefone;
        document.getElementById('endereco').value = professionalData.endereco;
        document.getElementById('cep').value = professionalData.cep;
        document.getElementById('dataNascimento').value = professionalData.dataNascimento;
        document.getElementById('crp').value = professionalData.crp;
    } else {
        alert('Erro ao carregar dados do profissional');
    }
}

// Função para enviar as alterações de cadastro
async function handleSubmit(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    // Coleta os dados dos campos do formulário
    const cpf = document.getElementById('cpf').value;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const endereco = document.getElementById('endereco').value;
    const cep = document.getElementById('cep').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    const crp = document.getElementById('crp').value;
    const senha = document.getElementById('senha').value; // Senha pode ser opcional

    // Cria um objeto com os dados a serem enviados
    const updatedData = { nome, email, telefone, endereco, cep, dataNascimento, crp };
    if (senha) updatedData.senha = senha; // Adiciona a senha se for preenchida

    try {
        // Envia os dados atualizados para o backend via PATCH
        const response = await fetch(`/sistema/cadastro/cpf/${cpf}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        const result = await response.json();

        // Verifica se a atualização foi bem-sucedida
        if (response.ok) {
            alert('Cadastro atualizado com sucesso!');
            location.reload(); // Recarrega a página atual
        } else {
            alert(`Erro: ${result.message}`); // Exibe erro se houver
        }
    } catch (error) {
        console.error("Erro ao atualizar cadastro:", error);
        alert("Ocorreu um erro ao tentar atualizar o cadastro.");
    }
}

// Chama a função para carregar os dados do profissional quando a página for carregada
window.onload = loadProfessionalData;

// Adiciona o listener para o formulário, que chama a função handleSubmit quando enviado
document.getElementById('formEditarCadastro').addEventListener('submit', handleSubmit);
