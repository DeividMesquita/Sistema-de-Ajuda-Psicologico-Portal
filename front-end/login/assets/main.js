document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('http://localhost:1285/sistema/cadastro/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf, senha })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Login bem-sucedido!');
            console.log(data);

            // Armazena o token e o tipo de usuário no localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("tipo", data.tipo);

            // Redireciona para a página do paciente ou profissional
            if (data.tipo === "paciente") {
                window.location.href = "/Paciente/Paciente.html"; // Para o paciente
            } else if (data.tipo === "profissional") {
                window.location.href = "/Profissional/Profissional.html";
            }
        } else {
            alert(`Erro: ${data.message}`);
        }
    } catch (error) {
        console.error("Erro no login: ", error);
        alert("Ocorreu um erro ao tentar realizar o login.");
    }
});

// Função para alternar a visibilidade da senha
function togglePassword() {
    const senhaField = document.getElementById('senha');  // Alterado de 'password' para 'senha'
    const eyeIcon = document.querySelector('.toggle-password');

    if (senhaField.type === 'password') {
        senhaField.type = 'text';
        eyeIcon.textContent = '🙈'; // Altera o ícone para indicar que a senha está visível
    } else {
        senhaField.type = 'password';
        eyeIcon.textContent = '👁️'; // Volta o ícone para o estado padrão
    }
}