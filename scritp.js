(function() {
    // ------ Navegação entre seções ------
    const links = document.querySelectorAll('.nav-link');
    const secoes = {
      home: document.getElementById('home'),
      projeto: document.getElementById('projeto'),
      quizz: document.getElementById('quizz'),
      flashcards: document.getElementById('flashcards')
    };

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const secaoId = link.dataset.secao;
        // esconde todas
        Object.values(secoes).forEach(sec => sec.classList.remove('ativa'));
        // mostra a escolhida
        if (secoes[secaoId]) secoes[secaoId].classList.add('ativa');
        // atualiza estilo dos links
        links.forEach(l => l.classList.remove('ativa'));
        link.classList.add('ativa');
      });
    });

    // ------ QUIZZ (5 perguntas) ------
    const questoes = [
      {
        pergunta: "Quantas cores principais Newton identificou no espectro da luz solar?",
        alternativas: ["5", "6", "7", "8"],
        correta: 2
      },
      {
        pergunta: "Qual fenômeno ocorre quando o disco de Newton gira rapidamente?",
        alternativas: ["Separação das cores", "Sobreposição na retina → branco", "Reflexão total", "Difração"],
        correta: 1
      },
      {
        pergunta: "O disco de Newton é usado principalmente para demonstrar:",
        alternativas: ["Refração", "Síntese aditiva de cores", "Difração da luz", "Polarização"],
        correta: 1
      },
      {
        pergunta: "Qual cor possui o maior comprimento de onda no espectro visível?",
        alternativas: ["Violeta", "Azul", "Verde", "Vermelho"],
        correta: 3
      },
      {
        pergunta: "No projeto da piscina, a cor escura dos coletores ajuda a:",
        alternativas: ["Refletir mais luz", "Absorver mais radiação", "Diminuir a temperatura", "Aumentar a refração"],
        correta: 1
      }
    ];

    let indiceQuizz = 0;
    let pontuacao = 0;
    let quizzRespondido = false;
    const perguntaEl = document.getElementById('perguntaQuizz');
    const alternativasEl = document.getElementById('alternativasQuizz');
    const proximaBtn = document.getElementById('proximaQuizz');
    const resultadoEl = document.getElementById('resultadoQuizz');

    function carregarQuizz() {
      quizzRespondido = false;
      const q = questoes[indiceQuizz];
      perguntaEl.textContent = q.pergunta;
      alternativasEl.innerHTML = '';
      q.alternativas.forEach((alt, idx) => {
        const div = document.createElement('div');
        div.className = 'alternativa';
        div.textContent = alt;
        div.dataset.index = idx;
        div.addEventListener('click', () => selecionarAlternativa(idx, div));
        alternativasEl.appendChild(div);
      });
      resultadoEl.textContent = '';
      proximaBtn.textContent = (indiceQuizz === questoes.length - 1) ? 'Ver resultado' : 'Próxima';
    }

    function selecionarAlternativa(idx, el) {
      if (quizzRespondido) return;
      const q = questoes[indiceQuizz];
      const todas = document.querySelectorAll('.alternativa');
      todas.forEach(alt => alt.classList.remove('selecionada', 'correto', 'errado'));
      el.classList.add('selecionada');
      // verifica
      const correta = q.correta;
      if (idx === correta) {
        el.classList.add('correto');
        pontuacao++;
      } else {
        el.classList.add('errado');
        // mostra correta
        todas.forEach((alt, i) => { if (i === correta) alt.classList.add('correto'); });
      }
      quizzRespondido = true;
    }

    proximaBtn.addEventListener('click', () => {
      if (!quizzRespondido && indiceQuizz < questoes.length) {
        resultadoEl.textContent = '⚠️ Selecione uma alternativa antes de avançar.';
        return;
      }
      if (indiceQuizz < questoes.length - 1) {
        indiceQuizz++;
        carregarQuizz();
      } else {
        // fim
        resultadoEl.innerHTML = `🏁 Quizz finalizado! Pontuação: ${pontuacao}/${questoes.length}`;
        proximaBtn.disabled = true;
        proximaBtn.style.opacity = 0.5;
        // opção reiniciar
        const reiniciarBtn = document.createElement('button');
        reiniciarBtn.className = 'btn';
        reiniciarBtn.textContent = '↻ Recomeçar Quizz';
        reiniciarBtn.addEventListener('click', () => {
          indiceQuizz = 0;
          pontuacao = 0;
          proximaBtn.disabled = false;
          proximaBtn.style.opacity = 1;
          carregarQuizz();
          reiniciarBtn.remove();
        });
        document.getElementById('quizzContainer').appendChild(reiniciarBtn);
      }
    });

    // Inicializa quizz
    carregarQuizz();

    // ------ FLASHCARDS (conteúdo) ------
    const flashcardsData = [
      { frente: "Disco de Newton", verso: "Experimento que mostra que a luz branca é composta por 7 cores." },
      { frente: "Cores do arco-íris", verso: "Vermelho, laranja, amarelo, verde, azul, anil e violeta." },
      { frente: "Síntese aditiva", verso: "Mistura de cores-luz: vermelho + verde = amarelo, etc." },
      { frente: "Aplicação no projeto", verso: "Placas escuras absorvem todo o espectro, otimizando aquecimento." },
      { frente: "Óptica + automação", verso: "Sensores LDR e temperatura controlam bombas para eficiência." },
      { frente: "Acessibilidade", verso: "Alto contraste, fontes legíveis, navegação por teclado." }
    ];

    let cardAtual = 0;
    let virado = false;
    const frontEl = document.getElementById('flashcardFront');
    const cardIndexEl = document.getElementById('cardIndex');
    const cardTotalEl = document.getElementById('cardTotal');

    function atualizarCard() {
      const data = flashcardsData[cardAtual];
      frontEl.textContent = virado ? data.verso : data.frente;
      cardIndexEl.textContent = cardAtual + 1;
      cardTotalEl.textContent = flashcardsData.length;
    }

    document.getElementById('btnVirar').addEventListener('click', () => {
      virado = !virado;
      atualizarCard();
    });

    document.getElementById('btnProxCard').addEventListener('click', () => {
      cardAtual = (cardAtual + 1) % flashcardsData.length;
      virado = false;
      atualizarCard();
    });

    document.getElementById('btnResetCard').addEventListener('click', () => {
      cardAtual = 0;
      virado = false;
      atualizarCard();
    });

    // flashcard também vira ao clicar
    frontEl.addEventListener('click', () => {
      virado = !virado;
      atualizarCard();
    });

    atualizarCard();

    // Acessibilidade extra: foco visível
    document.querySelectorAll('a, button, .alternativa').forEach(el => {
      el.setAttribute('tabindex', '0');
    });

  })();