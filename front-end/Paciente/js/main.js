$(document).ready(function () {
  // Inicializar o Owl Carousel
  const owl = $('.owl-carousel').owlCarousel({
    items: 3,
    loop: true,
    margin: 20,
    autoplay:true,
    center: true,
    nav: false,
    dots: true,
    startPosition: 1,
    slideTransition: 'ease-in',
    responsive: {
      0: {
        items: 1,
        margin: 10
      },
      600: {
        items: 1,
        margin: 20
      },
      1000: {
        items: 1
      }
    }
  });
});

// Função para mostrar o modal
const showModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'block';
  }
};

// Função para fechar o modal
const closeModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  }
};

// Evento para exibir o modal do mapa
document.getElementById('show-map').addEventListener('click', function (event) {
  event.preventDefault(); // Evita o scroll para o ID
  showModal('map-modal');
});

// Evento para fechar o modal do mapa
document.getElementById('close-map').addEventListener('click', function () {
  closeModal('map-modal');
});
