

// Respostas corretas de cada conta (na ordem 1 a 6)
// Conta 1: 11×2=22 | Conta 2: 6×8=48 | Conta 3: 4×6=24
// Conta 4: 86÷2=43 | Conta 5: 15-12=3 | Conta 6: 29×2=58
const RESPOSTAS = [22, 48, 24, 43, 3, 58];

const RESPOSTAS_RUA = [
  'rua formosa',
  'formosa',
  'r. formosa',
  'r formosa'
];


// Página que abre ao acertar a rua
const PAGINA_PARABENS = 'parabens.html';

// Cores das partículas de fundo
const CORES_PARTICULAS = ['#e62020', '#ff4444', '#cc0000', '#ffffff'];

// Cores dos confetes na página de parabéns
const CORES_CONFETES = ['#e62020', '#ff4444', '#ffcc00', '#ffffff', '#ff88cc', '#ff6600'];

// Quantidade de confetes
const QTD_CONFETES = 90;


// ================================================================
//  ESTADO INTERNO — controla o que já foi respondido
// ================================================================

// Array de booleanos: true = conta respondida corretamente
// [false, false, false, false, false, false] no início
let contasCorretas = [false, false, false, false, false, false];

// Guarda quantas contas já foram respondidas
let totalCorretas = 0;


// ================================================================
//  FUNÇÕES — POPUP 1 (as contas)
// ================================================================

// ── Abre o popup das contas ────────────────────────────────────
function abrirContas() {
  mostrarOverlay();
  mostrarPopup('popup-contas');
}


function verificarConta(id, gabarito) {
  const input  = document.getElementById('conta-' + id);
  const grupo  = document.getElementById('grupo-' + id);
  const indice = id - 1; 

  const valor = parseInt(input.value);
  

  if (valor === gabarito) {
    // CORRETA

    
    if (!contasCorretas[indice]) {
      contasCorretas[indice] = true;
      totalCorretas++;
    }

    // Aplica estilo visual de "correta"
    grupo.classList.add('correta');

    // Desabilita o input (não deixa mais mudar)
    input.disabled = true;

    // Revela o pedaço da coordenada correspondente
    revelarParte(id);

    // Atualiza o contador de progresso
    atualizarProgresso();

    // Se todas as 6 estão corretas abre popup da coordenada
    if (totalCorretas === 6) {
      setTimeout(abrirCoord, 900);
      // setTimeout(função, ms) → espera 900ms para abrir
    }

  } else {
    //  ERRADA (ou ainda digitando)
    // Se tinha marcado como correta antes (não deveria acontecer,
    // mas por segurança):
    if (contasCorretas[indice]) {
      contasCorretas[indice] = false;
      totalCorretas--;
      grupo.classList.remove('correta');
      esconderParte(id);
      atualizarProgresso();
    }
  }
}

// ── Revela um pedaço da coordenada 
function revelarParte(id) {
  const span = document.getElementById('p' + id);

  // Textos que aparecem para cada parte 
  const textos = ['22', '48', '24.09', '43', '03', '58.18'];
  span.textContent = textos[id - 1];
  span.classList.add('revelado');
}

// ── Esconde uma parte
function esconderParte(id) {
  const span = document.getElementById('p' + id);
  const vazios = ['??', '??', '??.09', '??', '??', '??.18'];
  span.textContent = vazios[id - 1];
  span.classList.remove('revelado');
}

// ── Atualiza o texto "X / 6 resolvidas" ───────────────────────
function atualizarProgresso() {
  const el = document.getElementById('progresso');
  el.textContent = totalCorretas + ' / 6 resolvidas';

  // Se tudo foi resolvido, deixa a coordenada verde
  if (totalCorretas === 6) {
    document.getElementById('coordenada-preview').classList.add('completa');
  }
}


// ================================================================
//  FUNÇÕES — POPUP 2 (coordenada + campo da rua)
// ================================================================

// ── Abre o popup da coordenada (após resolver todas as contas) ─
function abrirCoord() {
  esconderPopup('popup-contas');
  setTimeout(function() {
    mostrarPopup('popup-rua');
    // Foca automaticamente no campo de texto
    setTimeout(function() {
      const campo = document.getElementById('campo-rua');
      if (campo) campo.focus();
    }, 400);
  }, 350);
}

// ── Verifica o nome da rua digitado ───────────────────────────
function verificarRua() {
  const campo = document.getElementById('campo-rua');
  const erro  = document.getElementById('erro-rua');


  const digitado = campo.value.trim().toLowerCase();

  if (digitado === '') {
    mostrarErro(erro, '⚠️ Digite o nome da rua primeiro!');
    return; // para a função aqui
  }

  // Verifica se o que foi digitado está na lista de respostas aceitas
  if (RESPOSTAS_RUA.includes(digitado)) {
    // ✔ CORRETO → vai para a página de parabéns
    fecharTudo();
    setTimeout(function() {
      window.location.href = PAGINA_PARABENS;
      // window.location.href → redireciona para outra página
    }, 400);
  } else {
    //  ERRADO
    mostrarErro(erro, '❌ Hmm, não é essa rua. Tente de novo!');
    campo.value = '';
    campo.focus();
  }
}

// ── Mostra mensagem de erro com animação ──────────────────────
function mostrarErro(elemento, mensagem) {
  elemento.textContent = mensagem;
  elemento.classList.remove('visivel');
  void elemento.offsetWidth; // força reinício da animação
  elemento.classList.add('visivel');
}


// ================================================================
//  FUNÇÕES — CONTROLE DOS POPUPS E OVERLAY
// ================================================================

function mostrarOverlay() {
  document.getElementById('overlay').classList.add('ativo');
}

function esconderOverlay() {
  document.getElementById('overlay').classList.remove('ativo');
}

function mostrarPopup(id) {
  const popup = document.getElementById(id);
  popup.classList.remove('saindo');
  popup.classList.add('ativo');
}

function esconderPopup(id) {
  const popup = document.getElementById(id);
  popup.classList.remove('ativo');
  popup.classList.add('saindo');
}

// Fecha tudo (chamado pelo overlay e botões "Fechar")
function fecharTudo() {
  esconderOverlay();
  esconderPopup('popup-contas');
  esconderPopup('popup-rua');
}


// ================================================================
//  EVENTO: ENTER confirma a rua no popup 2
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
  // DOMContentLoaded → espera o HTML carregar antes de rodar

  const campoRua = document.getElementById('campo-rua');
  if (campoRua) {
    campoRua.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') verificarRua();
      
    });
  }
});


// ================================================================
//  PARTÍCULAS DE FUNDO
// ================================================================
function criarParticulas() {
  const qtd = 22; 

  for (let i = 0; i < qtd; i++) {
    const p = document.createElement('div');
   

    p.className = 'particula';

    const tam = Math.random() * 5 + 2; 
    const cor = CORES_PARTICULAS[Math.floor(Math.random() * CORES_PARTICULAS.length)];

    p.style.cssText = `
      width: ${tam}px;
      height: ${tam}px;
      background: ${cor};
      left: ${Math.random() * 100}vw;
      bottom: -10px;
      opacity: ${Math.random() * 0.4 + 0.1};
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    

    document.body.appendChild(p);
   
  }
}


// ================================================================
//  CONFETES (página de parabéns)
// ================================================================
function criarConfetes() {
  const container = document.getElementById('confetes');
  if (!container) return;
  

  for (let i = 0; i < QTD_CONFETES; i++) {
    const c = document.createElement('div');
    c.className = 'confete';

    const w    = Math.random() * 10 + 6;
    const h    = Math.random() * 14 + 6;
    const cor  = CORES_CONFETES[Math.floor(Math.random() * CORES_CONFETES.length)];
    const left = Math.random() * 100;
    const dur  = Math.random() * 3 + 2.5;
    const del  = Math.random() * 4;

    c.style.cssText = `
      width: ${w}px;
      height: ${h}px;
      background: ${cor};
      left: ${left}%;
      top: -20px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '3px'};
      animation-duration: ${dur}s;
      animation-delay: ${del}s;
      opacity: ${Math.random() * 0.5 + 0.5};
    `;

    container.appendChild(c);
  }
}


// ================================================================
//  INICIALIZAÇÃO — roda quando a página carrega
// ================================================================
window.addEventListener('load', function() {
  criarParticulas();

  // Confetes só na página de parabéns
  if (window.location.href.includes('parabens')) {
    criarConfetes();
  }
});