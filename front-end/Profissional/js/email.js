document.querySelectorAll(".accordion-link").forEach((button) => {
    button.addEventListener("click", async (e) => {
      if (e.target.id === "notify-professional") {
        const card = e.target.closest(".card");
        const nome = card.querySelector(".session-name").textContent;
        const dataHora = card.querySelector(".session-date").textContent;
  
        // Extrair data e hora do texto
        const [data, hora] = dataHora.replace(/\s+/g, "").split("|");
  
        try {
            const response = await fetch("http://localhost:1285/send-email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ nome, data, hora }),
            });
          
            const text = await response.text(); // Pega a resposta como texto bruto
            console.log("Resposta do servidor:", text);
          
            const result = JSON.parse(text); // Converte para JSON
            if (response.ok) {
              alert(result.message);
            } else {
              alert(`Erro: ${result.message}`);
            }
          } catch (error) {
            console.error("Erro ao enviar o e-mail:", error);
            alert("Não foi possível enviar o e-mail.");
          }          
      }
    });
  });
  