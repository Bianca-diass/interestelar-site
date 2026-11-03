
document.addEventListener("DOMContentLoaded", () => {

    const slider = document.querySelector(".slider");
    const btnNext = document.querySelector(".next");
    const btnPrev = document.querySelector(".prev");

    if (!slider || !btnNext || !btnPrev) {
        console.error("Elementos das curiosidades não encontrados!");
        return;
    }

    // Próxima curiosidade
    btnNext.addEventListener("click", () => {
        const primeiroItem = slider.querySelector(".item");

        if (primeiroItem) {
            slider.appendChild(primeiroItem);
        }
    });

    // Curiosidade anterior
    btnPrev.addEventListener("click", () => {
        const itens = slider.querySelectorAll(".item");

        if (itens.length > 0) {
            slider.prepend(itens[itens.length - 1]);
        }
    });

});
