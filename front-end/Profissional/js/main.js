$(document).ready(function () {
    // Ao clicar no link "Ver mais"
    $(".toggle-accordion").click(function () {
      const cardBody = $(this).closest(".card-body");
      const accordionContent = cardBody.find(".accordion-content");
      const card = cardBody.closest(".session-card");
      const arrowIcon = card.find(".arrow-icon");
  
      // Fecha outros accordions
      $(".accordion-content").not(accordionContent).removeClass("show");
      $(".session-card").not(card).removeClass("active");
      $(".arrow-icon").not(arrowIcon).hide(); // Esconde as setas de outros cards
  
      // Alterna o estado do card clicado
      accordionContent.toggleClass("show"); // Alterna a classe show para aplicar a transição de max-height
      card.toggleClass("active");
  
      // Atualiza a visibilidade do botão e da seta dependendo do estado do accordion
      const button = cardBody.find(".toggle-accordion");
      if (card.hasClass("active")) {
        button.hide(); // Esconde o link "Ver mais"
        arrowIcon.show(); // Exibe a seta
      } else {
        button.show(); // Exibe o link "Ver mais"
        arrowIcon.hide(); // Esconde a seta
      }
    });
  
    // Ao clicar na seta
    $(".arrow-icon").click(function () {
      const card = $(this).closest(".session-card");
      const accordionContent = card.find(".accordion-content");
  
      // Alterna o estado do accordion (fecha ou abre)
      accordionContent.toggleClass("show"); // Alterna a classe show para aplicar a transição de max-height
      card.toggleClass("active");
  
      // Atualiza a visibilidade do botão e da seta dependendo do estado do accordion
      const button = card.find(".toggle-accordion");
      const arrowIcon = card.find(".arrow-icon");
  
      if (card.hasClass("active")) {
        button.hide(); // Esconde o link "Ver mais"
        arrowIcon.show(); // Exibe a seta
      } else {
        button.show(); // Exibe o link "Ver mais"
        arrowIcon.hide(); // Esconde a seta
      }
    });
  });

  function entrarEmContato(nome, data, horario) {
    // Endereço fixo
    const local = "R. Cel. Matos Dourado, 1499 - Pici";
    
     // Mensagem personalizada
     const mensagem = `Olá ${nome}, tudo bem? Sou o responsável pela sua sessão de terapia aqui no Cuca Pici. Estarei aguardando você no dia ${data} às ${horario}. O endereço é ${local}.`;

    // Substituindo o número de WhatsApp do profissional
    let numeroWhatsApp;
    switch (nome) {
      case "Nicaele Pinheiro":
        numeroWhatsApp = "558588521569";
        break;
      case "João Bento":
        numeroWhatsApp = "558596839085";
        break;
      case "Renison Moita":
        numeroWhatsApp = "558592874871";
        break;
      case "Nelson Oliveira":
        numeroWhatsApp = "558589118556";
        break;
      case "Deividson Mesquita":
        numeroWhatsApp = "558591302697";
        break;
      case "Sarah Bernardino":
        numeroWhatsApp = "558596777707";
        break;
      default:
        alert("Profissional não encontrado!");
        return;
    }

    // Formatar URL para WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    
    // Redirecionar para o WhatsApp com a mensagem
    window.open(urlWhatsApp, "_blank");
  }
