document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const cpf = document.getElementById('cpf').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, cpf, password }),
    });

    const data = await response.json();
    if (response.ok) {
        alert('Login bem-sucedido!');
        console.log(data);
    } else {
        alert(`Erro: ${data.message}`);
    }
});


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
