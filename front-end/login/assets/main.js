document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const cpf = document.getElementById('cpf').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:1285/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf, password })  // Enviando CPF e senha no corpo
        });

        const data = await response.json();

        if (response.ok) {
            alert('Login bem-sucedido!');
            console.log(data);

            // Armazenar o token e o tipo de usuário no localStorage para uso posterior
            localStorage.setItem("token", data.token);
            localStorage.setItem("tipo", data.tipo);  // Salva o tipo (paciente ou profissional)

            // Redireciona para a página do paciente ou profissional
            if (data.tipo === "paciente") {
                window.location.href = "/front-end/Paciente/Paciente.html";  // Página do paciente
            } else if (data.tipo === "profissional") {
                window.location.href = "/front-end/Profissional/Profissional.html";  // Página do profissional
            }
        } else {
            alert(`Erro: ${data.message}`);
        }
    } catch (error) {
        console.error("Erro no login: ", error);
    }
});

// Função para alternar a visibilidade da senha
function togglePassword() {
    const passwordField = document.getElementById('password');
    const eyeIcon = document.querySelector('.toggle-password');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.textContent = '🙈'; // Altera o ícone para indicar que a senha está visível
    } else {
        passwordField.type = 'password';
        eyeIcon.textContent = '👁️'; // Volta o ícone para o estado padrão
    }
}
