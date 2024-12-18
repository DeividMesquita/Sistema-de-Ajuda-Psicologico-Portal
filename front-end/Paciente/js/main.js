$(document).ready(function() {
    // Inicializar o Owl Carousel
    const owl = $('.owl-carousel').owlCarousel({
        items: 3,
        loop: true,
        margin: 20,
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


// Mostrar o modal
document.getElementById('show-map').addEventListener('click', function (event) {
    event.preventDefault(); // Evita o scroll para o ID
    document.getElementById('map-modal').style.display = 'block';
});

// Fechar o modal
document.getElementById('close-map').addEventListener('click', function () {
    document.getElementById('map-modal').style.display = 'none';
});