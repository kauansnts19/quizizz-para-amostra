
const questions = [
    {
        category: "LÓGICA DE PROGRAMAÇÃO",
        question: "Qual é a principal finalidade de um algoritmo?",
        answers: [
            "Criar componentes físicos",
            "Resolver um problema por etapas",
            "Substituir o sistema operacional",
            "Armazenar apenas imagens"
        ],
        correct: 1,
        explanation: "Um algoritmo é uma sequência finita e organizada de instruções para resolver um problema."
    },
    {
        category: "LINGUAGENS DE PROGRAMAÇÃO",
        question: "Qual linguagem é amplamente utilizada para adicionar interatividade a páginas web?",
        answers: [
            "HTML",
            "CSS",
            "JavaScript",
            "SQL"
        ],
        correct: 2,
        explanation: "JavaScript permite criar interações, validar formulários e atualizar conteúdos de páginas web."
    },
    {
        category: "DESENVOLVIMENTO WEB",
        question: "Qual é a função principal do HTML?",
        answers: [
            "Estruturar o conteúdo de uma página",
            "Gerenciar bancos de dados",
            "Proteger o computador contra vírus",
            "Configurar redes de computadores"
        ],
        correct: 0,
        explanation: "HTML define a estrutura e os elementos de uma página, como títulos, parágrafos, imagens e formulários."
    },
    {
        category: "ESTILIZAÇÃO",
        question: "Para que serve o CSS no desenvolvimento de sites?",
        answers: [
            "Executar consultas SQL",
            "Criar algoritmos de ordenação",
            "Armazenar dados dos usuários",
            "Definir cores, layouts e estilos visuais"
        ],
        correct: 3,
        explanation: "CSS controla a aparência dos elementos HTML, incluindo cores, fontes, espaçamentos e layouts."
    },
    {
        category: "BANCO DE DADOS",
        question: "Qual comando SQL é utilizado para consultar dados de uma tabela?",
        answers: [
            "DELETE",
            "SELECT",
            "UPDATE",
            "INSERT"
        ],
        correct: 1,
        explanation: "SELECT permite recuperar e consultar informações armazenadas em tabelas de um banco de dados."
    },
    {
        category: "DESENVOLVIMENTO DE SISTEMAS",
        question: "O que significa a sigla IDE?",
        answers: [
            "Internet de Dados Externos",
            "Identificador Digital Eletrônico",
            "Ambiente de Desenvolvimento Integrado",
            "Interface de Distribuição Estática"
        ],
        correct: 2,
        explanation: "IDE significa Integrated Development Environment, ou Ambiente de Desenvolvimento Integrado."
    },
    {
        category: "LÓGICA DE PROGRAMAÇÃO",
        question: "Em programação, para que serve uma estrutura condicional IF?",
        answers: [
            "Executar uma ação dependendo de uma condição",
            "Apagar todos os arquivos do sistema",
            "Criar automaticamente um banco de dados",
            "Repetir um bloco de código infinitamente"
        ],
        correct: 0,
        explanation: "O IF verifica uma condição e permite executar determinado bloco de código quando ela é verdadeira."
    },
    {
        category: "ENGENHARIA DE SOFTWARE",
        question: "Qual é a principal finalidade dos testes de software?",
        answers: [
            "Aumentar o tamanho dos arquivos",
            "Eliminar a necessidade de documentação",
            "Impedir futuras atualizações",
            "Identificar falhas e verificar o funcionamento do sistema"
        ],
        correct: 3,
        explanation: "Testes ajudam a identificar defeitos e verificar se o sistema atende aos requisitos esperados."
    }
];

// Elementos da interface
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const playerNameInput = document.getElementById("player-name");
const playerDisplay = document.getElementById("player-display");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const reviewBtn = document.getElementById("review-btn");

const questionCounter = document.getElementById("question-counter");
const scoreDisplay = document.getElementById("score-display");
const questionCategory = document.getElementById("question-category");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const progressBar = document.getElementById("progress-bar");

const timerElement = document.getElementById("timer");
const timeLeftElement = document.getElementById("time-left");

const resultEmoji = document.getElementById("result-emoji");
const resultTitle = document.getElementById("result-title");
const resultMessage = document.getElementById("result-message");
const finalScore = document.getElementById("final-score");
const correctCount = document.getElementById("correct-count");
const wrongCount = document.getElementById("wrong-count");
const accuracy = document.getElementById("accuracy");
const reviewList = document.getElementById("review-list");

const QUESTION_TIME = 15;
const POINTS_PER_QUESTION = 1000;

let currentQuestion = 0;
let score = 0;
let correctAnswers = 0;
let timeLeft = QUESTION_TIME;
let timer = null;
let answered = false;
let gameFinished = false;
let playerName = "Programador";
let answerHistory = [];

// Embaralha as perguntas para que as partidas variem.
function shuffleQuestions(list) {
    const shuffled = [...list];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

let gameQuestions = [...questions];

// Inicia o jogo
startBtn.addEventListener("click", startGame);

playerNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        startGame();
    }
});

function startGame() {
    clearInterval(timer);

    playerName = playerNameInput.value.trim() || "Programador";

    currentQuestion = 0;
    score = 0;
    correctAnswers = 0;
    answered = false;
    gameFinished = false;
    answerHistory = [];
    gameQuestions = shuffleQuestions(questions);

    playerDisplay.textContent = playerName;

    startScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    renderQuestion();
}

// Exibe uma pergunta
function renderQuestion() {
    clearInterval(timer);

    if (currentQuestion >= gameQuestions.length) {
        finishGame();
        return;
    }

    answered = false;
    timeLeft = QUESTION_TIME;

    const question = gameQuestions[currentQuestion];

    questionCounter.textContent =
        `PERGUNTA ${currentQuestion + 1} DE ${gameQuestions.length}`;

    scoreDisplay.textContent = `${score} pontos`;
    questionCategory.textContent = question.category;
    questionText.textContent = question.question;

    progressBar.style.width =
        `${((currentQuestion + 1) / gameQuestions.length) * 100}%`;

    feedback.className = "feedback hidden";
    feedback.textContent = "";
    nextBtn.classList.add("hidden");

    timerElement.classList.remove("warning");
    timeLeftElement.textContent = timeLeft;

    answersContainer.replaceChildren();

    const letters = ["A", "B", "C", "D"];

    question.answers.forEach((answer, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "answer-btn";
        button.dataset.index = index;

        const letter = document.createElement("span");
        letter.className = "answer-letter";
        letter.textContent = letters[index];

        const text = document.createElement("span");
        text.textContent = answer;

        button.append(letter, text);

        button.addEventListener("click", () => {
            selectAnswer(index);
        });

        answersContainer.appendChild(button);
    });

    startTimer();
}

// Cronômetro de 15 segundos
function startTimer() {
    clearInterval(timer);

    timer = setInterval(() => {
        if (answered || gameFinished) {
            clearInterval(timer);
            return;
        }

        timeLeft--;
        timeLeftElement.textContent = timeLeft;

        if (timeLeft <= 5) {
            timerElement.classList.add("warning");
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            selectAnswer(null);
        }
    }, 1000);
}

// Verifica a alternativa selecionada
function selectAnswer(selectedIndex) {
    if (answered || gameFinished) return;

    answered = true;
    clearInterval(timer);

    const question = gameQuestions[currentQuestion];
    const isCorrect = selectedIndex === question.correct;

    if (isCorrect) {
        correctAnswers++;
        score += POINTS_PER_QUESTION;
    }

    answerHistory.push({
        question: question.question,
        answers: question.answers,
        correct: question.correct,
        selected: selectedIndex,
        isCorrect: isCorrect,
        explanation: question.explanation
    });

    const buttons = answersContainer.querySelectorAll(".answer-btn");

    buttons.forEach((button, index) => {
        button.disabled = true;

        if (index === question.correct) {
            button.classList.add("correct");
        }

        if (index === selectedIndex && !isCorrect) {
            button.classList.add("incorrect");
        }
    });

    feedback.classList.remove("hidden");
    feedback.classList.add(isCorrect ? "success" : "error");

    if (isCorrect) {
        feedback.textContent =
            `🎉 Resposta correta! +${POINTS_PER_QUESTION} pontos. ${question.explanation}`;
    } else if (selectedIndex === null) {
        feedback.textContent =
            `⏰ Tempo esgotado! ${question.explanation}`;
    } else {
        feedback.textContent =
            `❌ Resposta incorreta. ${question.explanation}`;
    }

    scoreDisplay.textContent = `${score} pontos`;

    nextBtn.textContent =
        currentQuestion === gameQuestions.length - 1
            ? "Ver resultado 🏆"
            : "Próxima pergunta →";

    nextBtn.classList.remove("hidden");
}

// Avança para a próxima pergunta
nextBtn.addEventListener("click", () => {
    if (!answered) return;

    currentQuestion++;
    renderQuestion();
});

// Apresenta o resultado final
function finishGame() {
    clearInterval(timer);
    gameFinished = true;

    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    const total = gameQuestions.length;
    const wrong = total - correctAnswers;
    const percentage = Math.round((correctAnswers / total) * 100);

    finalScore.textContent = score.toLocaleString("pt-BR");
    correctCount.textContent = correctAnswers;
    wrongCount.textContent = wrong;
    accuracy.textContent = `${percentage}%`;

    if (percentage === 100) {
        resultEmoji.textContent = "🏆";
        resultTitle.textContent = "Perfeito, " + playerName + "!";
        resultMessage.textContent =
            "Incrível! Você acertou todas as perguntas. Seu conhecimento em desenvolvimento está afiado!";
    } else if (percentage >= 75) {
        resultEmoji.textContent = "🚀";
        resultTitle.textContent = "Mandou muito bem, " + playerName + "!";
        resultMessage.textContent =
            "Excelente desempenho! Você demonstra um ótimo conhecimento em Desenvolvimento de Sistemas.";
    } else if (percentage >= 50) {
        resultEmoji.textContent = "💪";
        resultTitle.textContent = "Bom trabalho, " + playerName + "!";
        resultMessage.textContent =
            "Você está no caminho certo. Revise os conceitos e tente novamente para melhorar sua pontuação.";
    } else {
        resultEmoji.textContent = "📚";
        resultTitle.textContent = "Continue aprendendo, " + playerName + "!";
        resultMessage.textContent =
            "Todo programador começa aprendendo. Revise as respostas e faça uma nova tentativa!";
    }

    reviewList.classList.add("hidden");
    reviewBtn.textContent = "📋 Revisar respostas";
}

// Mostra as respostas e explicações
reviewBtn.addEventListener("click", () => {
    if (reviewList.classList.contains("hidden")) {
        renderReview();
        reviewList.classList.remove("hidden");
        reviewBtn.textContent = "Ocultar revisão";
    } else {
        reviewList.classList.add("hidden");
        reviewBtn.textContent = "📋 Revisar respostas";
    }
});

function renderReview() {
    reviewList.replaceChildren();

    const heading = document.createElement("h3");
    heading.textContent = "Revisão das perguntas";
    heading.style.marginBottom = "14px";

    reviewList.appendChild(heading);

    answerHistory.forEach((item, index) => {
        const card = document.createElement("article");
        card.className = "review-item";

        const title = document.createElement("strong");
        title.textContent = `${index + 1}. ${item.question}`;

        const status = document.createElement("p");
        status.className = item.isCorrect ? "review-correct" : "review-wrong";
        status.textContent = item.isCorrect
            ? "✓ Você acertou!"
            : item.selected === null
                ? "⏰ Tempo esgotado."
                : "✗ Você errou.";

        const correct = document.createElement("p");
        correct.textContent = `Resposta correta: ${item.answers[item.correct]}`;

        const explanation = document.createElement("p");
        explanation.textContent = item.explanation;

        card.append(title, status, correct, explanation);
        reviewList.appendChild(card);
    });
}

// Reinicia a partida
restartBtn.addEventListener("click", () => {
    resultScreen.classList.add("hidden");
    quizScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");

    playerNameInput.value = playerName === "Programador" ? "" : playerName;
    playerNameInput.focus();
});
