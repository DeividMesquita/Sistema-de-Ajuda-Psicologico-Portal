document.addEventListener('DOMContentLoaded', () => {
    // Manipulação do formulário de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
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

                    // Armazenar o token, tipo de usuário e CPF no localStorage
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("tipo", data.tipo);
                    localStorage.setItem("cpf", cpf); // Salva o CPF do paciente logado

                    // Verifica se o CPF foi salvo corretamente
                    console.log("CPF armazenado no localStorage:", localStorage.getItem('cpf'));

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
    }

    // Função para alternar a visibilidade da senha
    const eyeIcon = document.querySelector('.toggle-password');
    const senhaField = document.getElementById('senha');
    if (eyeIcon && senhaField) {
        eyeIcon.addEventListener('click', togglePassword);
    }

    // Função de alternância de visibilidade da senha
    function togglePassword() {
        if (senhaField.type === 'password') {
            senhaField.type = 'text';
            eyeIcon.textContent = '🙈'; // Altera o ícone para indicar que a senha está visível
        } else {
            senhaField.type = 'password';
            eyeIcon.textContent = '👁️'; // Volta o ícone para o estado padrão
        }
    }

    // Mostrar o modal
    const forgotPasswordLink = document.getElementById('forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function (e) {
            e.preventDefault(); // Evita o comportamento padrão do link
            document.getElementById('passwordModal').style.display = 'block'; // Mostra o modal
        });
    }

    // Fechar o modal
    const closeModalBtn = document.getElementById('close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    function closeModal() {
        document.getElementById('passwordModal').style.display = 'none';
    }

    // Enviar os dados para atualizar a senha
    const recoverPasswordForm = document.getElementById('recover-password-form');
    if (recoverPasswordForm) {
        recoverPasswordForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const cpf = document.getElementById('cpf-recovery').value;
            const newPassword = document.getElementById('new-password').value;

            try {
                // Fazer a requisição PATCH com a URL corrigida
                const response = await fetch('/sistema/cadastro/atualizar-senha', {
                    method: 'PATCH', // Usar PATCH para atualização
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cpf, newPassword })  // Enviar apenas o CPF e a nova senha
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Senha alterada com sucesso!');
                    closeModal(); // Fecha o modal
                } else {
                    alert(`Erro: ${data.message}`);
                }
            } catch (error) {
                console.error("Erro ao recuperar a senha:", error);
                alert("Ocorreu um erro ao tentar recuperar a senha.");
            }
        });
    }
});
