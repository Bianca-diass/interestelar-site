document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".elenco-grid article");

    // Verifica se existem cards do elenco
    if (!cards.length) {
        return;
    }

    // Animação de entrada dos cards
    const observador = new IntersectionObserver((entradas) => {

        entradas.forEach((entrada) => {

            if (entrada.isIntersecting) {
                entrada.target.classList.add("visivel");
                observador.unobserve(entrada.target);
            }

        });

    }, {
        threshold: 0.15
    });

    cards.forEach((card) => {
        observador.observe(card);
    });

});