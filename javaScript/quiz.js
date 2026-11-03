/* =========================================================
   QUIZ GARGANTUA · lógica (JavaScript puro)
   ========================================================= */
(function () {
  "use strict";

  /* Perguntas baseadas nas curiosidades da página */
  const QUESTIONS = [
    {
      question: "No planeta de Miller, 1 hora equivale a cerca de quantos anos na Terra?",
      options: ["1 ano", "7 anos", "23 anos", "100 anos"],
      answer: 1,
      explain: "A gravidade perto de Gargantua é tão forte que o tempo passa muito mais devagar: cerca de 7 anos terrestres para cada hora no planeta."
    },
    {
      question: "Qual cientista foi consultor e produtor executivo de Interestelar e ganhou o Nobel de Física em 2017?",
      options: ["Stephen Hawking", "Carl Sagan", "Kip Thorne", "Neil deGrasse Tyson"],
      answer: 2,
      explain: "Kip Thorne ajudou a garantir a base científica do filme e foi premiado pelas contribuições à detecção das ondas gravitacionais."
    },
    {
      question: "Qual teoria de Einstein explica por que o tempo corre mais devagar perto de Gargantua?",
      options: ["Teoria do Big Bang", "Mecânica quântica", "Relatividade geral", "Teoria das cordas"],
      answer: 2,
      explain: "Na relatividade geral, a massa curva o espaço e o tempo: quanto mais forte a gravidade, mais lento o relógio."
    },
    {
      question: "Qual é a massa aproximada de Gargantua?",
      options: ["Igual à do Sol", "10 vezes a do Sol", "1 milhão de vezes a do Sol", "100 milhões de vezes a do Sol"],
      answer: 3,
      explain: "Gargantua é um buraco negro supermassivo, com cerca de 100 milhões de vezes a massa do Sol."
    },
    {
      question: "Por que o brilho do disco de acreção foi suavizado no filme?",
      options: [
        "Para economizar tempo de renderização",
        "Para o público conseguir entender a imagem",
        "Porque o disco real é invisível",
        "Por ordem do estúdio de música"
      ],
      answer: 1,
      explain: "O efeito Doppler real deixaria um lado do disco muito mais claro e intenso, então o brilho foi suavizado para a cena ficar compreensível."
    },
    {
      question: "Qual instrumento é o grande destaque da trilha sonora de Hans Zimmer?",
      options: ["Piano de cauda", "Órgão de tubos", "Violino solo", "Guitarra elétrica"],
      answer: 1,
      explain: "Zimmer usou um órgão de tubos gravado em uma igreja de Londres, o que deu à trilha o tom grandioso e quase espiritual do filme."
    },
    {
      question: "Interestelar venceu o Oscar de qual categoria?",
      options: ["Melhor Filme", "Melhor Trilha Sonora", "Melhores Efeitos Visuais", "Melhor Diretor"],
      answer: 2,
      explain: "O filme levou o Oscar de Melhores Efeitos Visuais, graças ao trabalho da DNEG, que simulou Gargantua com base em equações reais."
    },
    {
      question: "Perto de qual planeta do Sistema Solar a equipe encontra o buraco de minhoca?",
      options: ["Marte", "Júpiter", "Saturno", "Netuno"],
      answer: 2,
      explain: "O buraco de minhoca aparece perto de Saturno e leva a tripulação a outra galáxia, onde fica Gargantua."
    },
    {
      question: "Em qual país foram filmadas as cenas dos planetas de gelo e de água?",
      options: ["Islândia", "Noruega", "Canadá", "Groenlândia"],
      answer: 0,
      explain: "As paisagens geladas e alagadas dos planetas foram gravadas na Islândia, em locações reais, sem depender só de efeitos digitais."
    },
    {
      question: "Quantos acres de milho Christopher Nolan mandou plantar para as cenas da fazenda?",
      options: ["Cerca de 50", "Cerca de 150", "Cerca de 500", "Cerca de 2.000"],
      answer: 2,
      explain: "Nolan mandou plantar cerca de 500 acres de milho de verdade para as cenas da Terra, e a colheita foi vendida depois das filmagens."
    }
  ];

  const RESULTS = [
    { min: 0, title: "Viajante iniciante", text: "Você está só começando a se aproximar do horizonte de eventos. Releia a página e tente de novo!" },
    { min: 4, title: "Astronauta em missão", text: "Você já domina boa parte da física de Gargantua. Falta pouco para a órbita perfeita." },
    { min: 8, title: "Mestre de Gargantua", text: "Você entende o buraco negro como o próprio Kip Thorne. Pontuação de respeito!" }
  ];

  /* Elementos */
  const $ = (id) => document.getElementById(id);
  const el = {
    questionView: $("questionView"), resultView: $("resultView"),
    question: $("question"), options: $("options"),
    feedback: $("feedback"), feedbackTitle: $("feedbackTitle"), feedbackText: $("feedbackText"),
    next: $("nextBtn"), restart: $("restartBtn"),
    counter: $("counter"), score: $("score"),
    progress: $("progress"), bar: $("progressBar"),
    ring: $("ring"), finalScore: $("finalScore"),
    resultTitle: $("resultTitle"), resultText: $("resultText")
  };

  const LETTERS = ["A", "B", "C", "D"];
  let current = 0;
  let score = 0;
  let locked = false;

  function setProgress(done) {
    const total = QUESTIONS.length;
    el.bar.style.width = (done / total) * 100 + "%";
    el.progress.setAttribute("aria-valuemax", String(total));
    el.progress.setAttribute("aria-valuenow", String(done));
  }

  function showQuestion() {
    const q = QUESTIONS[current];
    locked = false;

    el.counter.textContent = "Pergunta " + (current + 1) + " de " + QUESTIONS.length;
    el.question.textContent = q.question;
    el.options.innerHTML = "";
    el.feedback.hidden = true;
    el.next.hidden = true;
    setProgress(current);

    q.options.forEach((text, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";
      btn.dataset.index = String(i);

      const key = document.createElement("span");
      key.className = "option__key";
      key.textContent = LETTERS[i];

      const label = document.createElement("span");
      label.className = "option__text";
      label.textContent = text;

      btn.append(key, label);
      btn.addEventListener("click", () => choose(i));
      el.options.appendChild(btn);
    });

    el.questionView.classList.remove("is-entering");
    void el.questionView.offsetWidth; // reinicia a animação
    el.questionView.classList.add("is-entering");
  }

  function choose(index) {
    if (locked) return;
    locked = true;

    const q = QUESTIONS[current];
    const correct = index === q.answer;
    const buttons = el.options.querySelectorAll(".option");

    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.answer) btn.classList.add("is-correct");
      else if (i === index) btn.classList.add("is-wrong");
      else btn.classList.add("is-dim");
    });

    if (correct) {
      score += 1;
      el.score.textContent = String(score);
    }

    el.feedback.className = "feedback " + (correct ? "is-ok" : "is-no");
    el.feedbackTitle.textContent = correct ? "Resposta correta" : "Não foi dessa vez";
    el.feedbackText.textContent = q.explain;
    el.feedback.hidden = false;

    const last = current === QUESTIONS.length - 1;
    el.next.textContent = last ? "Ver resultado" : "Próxima pergunta";
    el.next.hidden = false;
    el.next.focus({ preventScroll: true });
  }

  function next() {
    if (current < QUESTIONS.length - 1) {
      current += 1;
      showQuestion();
    } else {
      showResult();
    }
  }

  function showResult() {
    const total = QUESTIONS.length;
    setProgress(total);
    el.counter.textContent = "Quiz concluído";

    const tier = RESULTS.filter((r) => score >= r.min).pop();
    el.finalScore.textContent = score + "/" + total;
    el.resultTitle.textContent = tier.title;
    el.resultText.textContent = tier.text;

    el.questionView.hidden = true;
    el.resultView.hidden = false;
    el.resultView.classList.remove("is-entering");
    void el.resultView.offsetWidth;
    el.resultView.classList.add("is-entering");

    el.ring.style.setProperty("--pct", "0");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => el.ring.style.setProperty("--pct", String((score / total) * 100)));
    });
  }

  function restart() {
    current = 0;
    score = 0;
    el.score.textContent = "0";
    el.resultView.hidden = true;
    el.questionView.hidden = false;
    showQuestion();
  }

  /* Eventos */
  el.next.addEventListener("click", next);
  el.restart.addEventListener("click", restart);

  /* Atalhos: teclas 1–4 escolhem a opção; Enter avança */
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (!el.questionView.hidden && !locked && /^[1-4]$/.test(e.key)) {
      const i = Number(e.key) - 1;
      if (i < QUESTIONS[current].options.length) choose(i);
    }
  });

  showQuestion();
})();