$(document).ready(function() {
    $('#emailForm').submit(function(e) {
      e.preventDefault();
      
      const subject = $('#emailSubject').val();
      const body = $('#emailBody').val();
  
      $.ajax({
        type: 'POST',
        url: '/send-doubt-email',  // Nova rota para enviar e-mail de dúvida
        data: JSON.stringify({ subject, body }),
        contentType: 'application/json',
        success: function(response) {
          alert('E-mail de dúvida enviado com sucesso!');
          $('#emailModal').modal('hide');  // Fecha o modal
        },
        error: function(error) {
          alert('Erro ao enviar o e-mail de dúvida.');
          console.error(error);
        }
      });
    });
  });
  