
document.getElementById("start-btn").addEventListener("click", function () {
    const inicio = document.getElementById("start-screen");
    const quiz = document.getElementById("quiz-screen");
    const nome = document.getElementById("player-name").value.trim();

    if (typeof questions === "undefined" || questions.length !== 8) {
        alert("Erro: as 8 perguntas não foram carregadas. Confira o arquivo script.js.");
        return;
    }

    playerName = nome || "Programador";
    playerDisplay.textContent = playerName;

    currentQuestion = 0;
    score = 0;
    correctAnswers = 0;
    answerHistory = [];
    gameFinished = false;
    gameQuestions = shuffleQuestions(questions);

    inicio.classList.add("hidden");
    quiz.classList.remove("hidden");

    renderQuestion();
});
