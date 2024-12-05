// Captura todos os links de "Notificar paciente"
const notifyLinks = document.querySelectorAll('.accordion-link');

// Adiciona o evento de clique a cada link
notifyLinks.forEach(link => {
    link.addEventListener('click', function() {
        const email = this.getAttribute('data-email');  // Pega o e-mail do atributo data-email
        
        // Agora fazemos uma requisição para o backend para enviar o e-mail
        fetch('/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: email,  // E-mail do paciente
                subject: 'Notificação de Consulta',
                text: 'Sua próxima consulta será dia 10/08 (quinta-feira) presencial no Cuca Pici das 09h às 10h. Fico no aguardo.'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'E-mail enviado com sucesso!') {
                alert('E-mail enviado com sucesso!');
            } else {
                alert('Erro ao enviar o e-mail');
            }
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
            alert('Erro ao enviar o e-mail');
        });
    });
});
