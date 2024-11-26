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
