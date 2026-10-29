/* ============================================================
   QUIZ DE DESENVOLVIMENTO DE SISTEMAS - lógica completa
   Para personalizar: edite o array "perguntas" abaixo.
   - tipo: "multipla" (4 alternativas) ou "vf" (verdadeiro/falso)
   - correta: índice da resposta certa (0 = primeira alternativa)
   ============================================================ */

const perguntas = [
  // ----- 5 perguntas de múltipla escolha -----
  { tipo: "multipla", texto: "Qual linguagem é utilizada principalmente para estruturar o conteúdo de uma página web?",
    opcoes: ["Python", "HTML", "SQL", "C++"], correta: 1 },
  { tipo: "multipla", texto: "O que é Inteligência Artificial (IA)?",
    opcoes: ["Um componente físico do computador.", "Um tipo de cabo de rede.",
             "Uma tecnologia capaz de realizar tarefas que normalmente exigem inteligência humana.",
             "Um sistema exclusivo para criar documentos."], correta: 2 },
  { tipo: "multipla", texto: "O que é hardware?",
    opcoes: ["A parte física de um computador, como teclado, memória RAM e processador.",
             "Os aplicativos instalados no computador.", "Uma linguagem de programação.", "Um site de pesquisas."], correta: 0 },
  { tipo: "multipla", texto: "Qual das alternativas apresenta um exemplo de software?",
    opcoes: ["Monitor.", "Mouse.", "Processador.", "Sistema operacional Windows."], correta: 3 },
  { tipo: "multipla", texto: "Qual é a principal função do JavaScript em um site?",
    opcoes: ["Substituir fisicamente as peças do computador.",
             "Adicionar interatividade e comportamentos dinâmicos às páginas web.",
             "Fabricar componentes eletrônicos.", "Armazenar exclusivamente imagens no monitor."], correta: 1 },

  // ----- 5 perguntas de verdadeiro ou falso -----
  { tipo: "vf", texto: "O CSS é usado para definir o estilo visual de uma página web, como cores e layout.", correta: 0 },
  { tipo: "vf", texto: "A memória RAM é um exemplo de software.", correta: 1 },
  { tipo: "vf", texto: "Um sistema operacional, como o Windows ou o Linux, é um tipo de software.", correta: 0 },
  { tipo: "vf", texto: "Java e JavaScript são exatamente a mesma linguagem de programação.", correta: 1 },
  { tipo: "vf", texto: "Sistemas de Inteligência Artificial podem aprender padrões a partir de dados.", correta: 0 }
];

const VF = ["VERDADEIRO", "FALSO"];

// ----- Referências aos elementos da página -----
const $ = (id) => document.getElementById(id);
const telas = { inicio: $("tela-inicio"), quiz: $("tela-quiz"), final: $("tela-final") };

// ----- Estado do jogo -----
let nome = "PLAYER 1";
let indice = 0;
let pontos = 0;
let respondeu = false;

function mostrarTela(qual) {
  Object.values(telas).forEach((t) => t.classList.remove("ativa"));
  telas[qual].classList.add("ativa");
}

/* ---------- Início / reinício ---------- */
function comecar() {
  nome = $("nome").value.trim().toUpperCase() || "PLAYER 1";
  indice = 0;
  pontos = 0;
  $("hud-nome").textContent = nome;
  $("confete").innerHTML = "";
  mostrarTela("quiz");
  mostrarPergunta();
}

/* ---------- Exibe a pergunta atual ---------- */
function mostrarPergunta() {
  const p = perguntas[indice];
  respondeu = false;

  $("hud-fase").textContent = `FASE ${indice + 1}/${perguntas.length}`;
  $("hud-pontos").textContent = `SCORE ${pontos}`;
  $("barra-prog").style.width = `${(indice / perguntas.length) * 100}%`;
  $("tipo").textContent = p.tipo === "vf" ? "▶ VERDADEIRO OU FALSO" : "▶ MÚLTIPLA ESCOLHA";
  $("pergunta").textContent = p.texto;
  $("feedback").textContent = "";
  $("feedback").className = "feedback";
  $("btn-proxima").hidden = true;

  const caixa = $("opcoes");
  caixa.innerHTML = "";
  caixa.className = "opcoes" + (p.tipo === "vf" ? " vf" : "");

  const textos = p.tipo === "vf" ? VF : p.opcoes;
  const letras = ["A", "B", "C", "D"];
  textos.forEach((texto, i) => {
    const b = document.createElement("button");
    b.className = "opcao";
    b.type = "button";
    b.textContent = p.tipo === "vf" ? texto : `${letras[i]}) ${texto}`;
    b.addEventListener("click", () => responder(i));
    caixa.appendChild(b);
  });

  // reinicia a animação de entrada
  const t = telas.quiz;
  t.classList.remove("ativa");
  void t.offsetWidth;
  t.classList.add("ativa");
}

/* ---------- Trata a resposta do jogador ---------- */
function responder(escolhida) {
  if (respondeu) return; // impede responder duas vezes
  respondeu = true;

  const p = perguntas[indice];
  const botoes = document.querySelectorAll(".opcao");
  const acertou = escolhida === p.correta;

  botoes.forEach((b, i) => {
    b.disabled = true;
    if (i === p.correta) b.classList.add("certa");
    else if (i === escolhida) b.classList.add("errada");
    else b.classList.add("apagada");
  });

  const fb = $("feedback");
  if (acertou) {
    pontos++;
    fb.textContent = "★ CORRETO! +1 PONTO ★";
    fb.classList.add("ok");
  } else {
    fb.textContent = "✖ INCORRETO! A resposta certa está em verde.";
    fb.classList.add("erro");
  }

  $("hud-pontos").textContent = `SCORE ${pontos}`;
  $("barra-prog").style.width = `${((indice + 1) / perguntas.length) * 100}%`;

  const prox = $("btn-proxima");
  prox.textContent = indice === perguntas.length - 1 ? "VER RESULTADO" : "PRÓXIMA PERGUNTA";
  prox.hidden = false;
  prox.focus();
}

/* ---------- Avança (só funciona depois de responder) ---------- */
function proxima() {
  if (!respondeu) return;
  indice++;
  if (indice < perguntas.length) mostrarPergunta();
  else mostrarResultado();
}

/* ---------- Tela final ---------- */
function mostrarResultado() {
  const total = perguntas.length;
  const pct = Math.round((pontos / total) * 100);
  let msg;

  if (pontos === total) msg = "PERFEITO! Você domina os conceitos de tecnologia!";
  else if (pct >= 60) msg = "MUITO BOM! Você está no caminho certo!";
  else msg = "CONTINUE ESTUDANDO! Você pode melhorar!";

  $("res-nome").textContent = nome;
  $("res-acertos").textContent = pontos;
  $("res-total").textContent = total;
  $("res-pct").textContent = pct;
  $("res-msg").textContent = msg;

  mostrarTela("final");
  if (pct >= 60) confete(); // comemoração em bom resultado
}

/* ---------- Confete neon ---------- */
function confete() {
  const cores = ["#ff2e97", "#00f0ff", "#ffe600", "#39ff14", "#ffffff"];
  const area = $("confete");
  for (let i = 0; i < 90; i++) {
    const c = document.createElement("div");
    c.className = "pedaco";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = cores[i % cores.length];
    c.style.animationDuration = 2 + Math.random() * 2.5 + "s";
    c.style.animationDelay = Math.random() * 1.2 + "s";
    area.appendChild(c);
  }
  setTimeout(() => (area.innerHTML = ""), 6500);
}

/* ---------- Eventos ---------- */
$("btn-comecar").addEventListener("click", comecar);
$("nome").addEventListener("keydown", (e) => { if (e.key === "Enter") comecar(); });
$("btn-proxima").addEventListener("click", proxima);
// Reinicia na hora: zera pontos e volta à pergunta 1 com o mesmo nome
$("btn-reiniciar").addEventListener("click", comecar);