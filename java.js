// ========== 8 PERGUNTAS FÁCEIS ==========
// Mistura de múltipla escolha (4 alternativas) + Verdadeiro/Falso
const questions = [
  // 1 - HTML (múltipla escolha)
  {
    category: "HTML",
    catClass: "cat-html",
    question: "O que significa a sigla HTML?",
    options: [
      "HyperText Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Machine Language",
      "Home Tool Markup Language"
    ],
    correct: 0,
    explanation: "HTML = HyperText Markup Language (Linguagem de Marcação de Hipertexto)."
  },
  // 2 - HTML (Verdadeiro ou Falso)
  {
    category: "HTML",
    catClass: "cat-html",
    question: "A tag <h1> é usada para criar o maior título em uma página HTML.",
    options: [
      "Verdadeiro",
      "Falso"
    ],
    correct: 0,
    explanation: "Verdadeiro! A tag <h1> representa o título de maior importância/tamanho."
  },
  // 3 - HTML (múltipla escolha)
  {
    category: "HTML",
    catClass: "cat-html",
    question: "Qual tag é usada para criar um parágrafo de texto?",
    options: [
      "<para>",
      "<p>",
      "<text>",
      "<paragraph>"
    ],
    correct: 1,
    explanation: "A tag correta é <p> (de paragraph)."
  },
  // 4 - CSS (múltipla escolha)
  {
    category: "CSS",
    catClass: "cat-css",
    question: "O que significa a sigla CSS?",
    options: [
      "Computer Style Sheets",
      "Cascading Style Sheets",
      "Creative Style System",
      "Colorful Style Sheets"
    ],
    correct: 1,
    explanation: "CSS = Cascading Style Sheets (Folhas de Estilo em Cascata)."
  },
  // 5 - CSS (Verdadeiro ou Falso)
  {
    category: "CSS",
    catClass: "cat-css",
    question: "A propriedade 'color' no CSS serve para mudar a cor do texto.",
    options: [
      "Verdadeiro",
      "Falso"
    ],
    correct: 0,
    explanation: "Verdadeiro! A propriedade 'color' define a cor do texto."
  },
  // 6 - CSS (múltipla escolha)
  {
    category: "CSS",
    catClass: "cat-css",
    question: "Como selecionamos um elemento pelo seu ID no CSS?",
    options: [
      ".nomeDoId",
      "#nomeDoId",
      "*nomeDoId",
      "id.nomeDoId"
    ],
    correct: 1,
    explanation: "No CSS, o seletor de ID usa o símbolo # (ex: #meuId)."
  },
  // 7 - JAVA (múltipla escolha)
  {
    category: "JAVA",
    catClass: "cat-java",
    question: "Qual é a forma correta de declarar o método principal (main) em Java?",
    options: [
      "public void main(String[] args)",
      "public static void main(String[] args)",
      "static void main()",
      "void main(String args)"
    ],
    correct: 1,
    explanation: "O método main correto é: public static void main(String[] args)"
  },
  // 8 - JAVA (Verdadeiro ou Falso)
  {
    category: "JAVA",
    catClass: "cat-java",
    question: "Em Java usamos System.out.println() para imprimir algo no console.",
    options: [
      "Verdadeiro",
      "Falso"
    ],
    correct: 0,
    explanation: "Verdadeiro! System.out.println() é o comando usado para imprimir no console em Java."
  }
];

// ========== ESTADO DO JOGO ==========
let currentQuestion = 0;
let score = 0;
let highScore = localStorage.getItem('arcadeDevHighScore') || 0;

// ========== FUNÇÕES ==========
function startQuiz() {
  currentQuestion = 0;
  score = 0;
  document.getElementById('startScreen').classList.remove('active');
  document.getElementById('quizScreen').classList.add('active');
  document.getElementById('scoreBoard').style.display = 'flex';
  document.getElementById('highScore').textContent = highScore;
  document.getElementById('totalQ').textContent = questions.length;
  showQuestion();
}

function showQuestion() {
  const q = questions[currentQuestion];
  
  document.getElementById('categoryTag').textContent = q.category;
  document.getElementById('categoryTag').className = 'category-tag ' + q.catClass;
  document.getElementById('questionNumber').textContent = `PERGUNTA ${currentQuestion + 1} / ${questions.length}`;
  document.getElementById('questionText').textContent = q.question;
  document.getElementById('qCounter').textContent = currentQuestion + 1;
  document.getElementById('currentScore').textContent = score;

  const optionsContainer = document.getElementById('optionsContainer');
  optionsContainer.innerHTML = '';

  q.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-option';
    btn.textContent = String.fromCharCode(65 + index) + ')  ' + opt;
    btn.onclick = () => selectAnswer(index);
    optionsContainer.appendChild(btn);
  });

  document.getElementById('feedback').className = 'feedback';
  document.getElementById('feedback').textContent = '';
  document.getElementById('nextBtn').style.display = 'none';
}

function selectAnswer(selected) {
  const q = questions[currentQuestion];
  const buttons = document.querySelectorAll('.btn-option');
  const feedback = document.getElementById('feedback');

  buttons.forEach(btn => btn.disabled = true);

  if (selected === q.correct) {
    buttons[selected].classList.add('correct');
    score++;
    document.getElementById('currentScore').textContent = score;
    feedback.textContent = '✔ ACERTOU! ' + q.explanation;
    feedback.className = 'feedback show correct';
  } else {
    buttons[selected].classList.add('wrong');
    buttons[q.correct].classList.add('correct');
    feedback.textContent = '✖ ERROU! ' + q.explanation;
    feedback.className = 'feedback show wrong';
  }

  document.getElementById('nextBtn').style.display = 'inline-block';
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById('quizScreen').classList.remove('active');
  document.getElementById('resultScreen').classList.add('active');
  document.getElementById('scoreBoard').style.display = 'none';

  const total = questions.length;

  document.getElementById('finalScore').textContent = `${score} / ${total}`;

  // Atualiza high score
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('arcadeDevHighScore', highScore);
  }

  // Rank e mensagem (ajustado para 8 perguntas)
  let rank, message, stars;

  if (score === total) {
    rank = "★★★ LENDÁRIO ★★★";
    message = "PERFEITO! Você dominou o básico de HTML, CSS e Java!";
    stars = "★★★★★";
  } else if (score >= 7) {
    rank = "★★ ARCADE MASTER ★★";
    message = "Excelente! Quase perfeito. Continue treinando!";
    stars = "★★★★☆";
  } else if (score >= 5) {
    rank = "★ BOM JOGADOR ★";
    message = "Bom trabalho! Você já sabe bastante do básico.";
    stars = "★★★☆☆";
  } else if (score >= 3) {
    rank = "INICIANTE";
    message = "Você está no caminho! Revise e jogue de novo.";
    stars = "★★☆☆☆";
  } else {
    rank = "NOOB MODE";
    message = "Não desanime! Todo mundo começa do zero. Tente outra vez!";
    stars = "★☆☆☆☆";
  }

  document.getElementById('rankText').textContent = rank;
  document.getElementById('resultMessage').textContent = message;
  document.getElementById('stars').textContent = stars;
}

function restartQuiz() {
  document.getElementById('resultScreen').classList.remove('active');
  document.getElementById('startScreen').classList.add('active');
}