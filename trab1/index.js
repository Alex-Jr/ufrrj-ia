// -1 é que ja passou, mas quanto menor é a quantidade de vezes que ja passou lá
// 0 é vazio 
// 1 é o robo
// 2 é o obstaculo
// 3 é a meta
let matrixBlocos = [];
let matrixDivs = [];

const delayMovimento = 50; // 1 segundo

const tamanhoGrid = 10;

let xRobo = 0;
let yRobo = 0;

const NORTE = 0;
const NORDESTE = 1;
const LESTE = 2;
const SUDESTE = 3;
const SUL = 4;
const SUDOESTE = 5;
const OESTE = 6;
const NOROESTE = 7

const DIRECOES = [0, 1, 2, 3, 4, 5, 6 ,7]
const DIRECOESTXT = [
  "NORTE",
  "NORDESTE",
  "LESTE",
  "SUDESTE",
  "SUL",
  "SUDOESTE",
  "OESTE",
  "NOROESTE"
];


const DIREITA = 1;
const ESQUERDA = -1;

let direcaoAtual = NORTE;

const xMeta = tamanhoGrid - 1;
const yMeta = tamanhoGrid - 1;

const custos = {
  parado: 1000,
  bater: 1000,
  girar: 1,
  andar: 0,
};

let custoAtual = 0;
let qntGiro = 0;
let qntMovimento = 0;

let timer;

function começar() {
  if(!timer) {
    timer = setInterval(loop, delayMovimento)
  }
}

function parar() {
  if(timer) {
    clearInterval(timer)
  }
}

function checaObstaculo(x, y) {
  // se não existir bloco ali ou se for um do tipo 2 (obstaculo)
  return matrixBlocos[x] === undefined 
    || matrixBlocos[x][y] === undefined 
    || matrixBlocos[x][y] === 2
}

function checaMeta(x, y) {
  return matrixBlocos[x][y] === 3
}

function calculaMovimento(direcao) {
  let yNovo = 0;
  let xNovo = 0;

  switch (direcao) {
    case NORTE:
      xNovo = xRobo;
      yNovo = yRobo - 1;
      break;
    case NORDESTE:
      xNovo = xRobo + 1;
      yNovo = yRobo - 1;
      break;
    case LESTE:
      xNovo = xRobo + 1;
      yNovo = yRobo;
      break;
    case SUDESTE:
      xNovo = xRobo + 1;
      yNovo = yRobo + 1;
      break;
    case SUL:
      xNovo = xRobo;
      yNovo = yRobo + 1;
      break;
    case SUDOESTE:
      xNovo = xRobo - 1;
      yNovo = yRobo + 1;
      break;
    case OESTE:
      xNovo = xRobo - 1;
      yNovo = yRobo;
      break;
    case NOROESTE:
      xNovo = xRobo - 1;
      yNovo = yRobo - 1;
      break;
  }
  
  return {
    xNovo, yNovo,
  }
}

function calcularMenorNumeroGiros(direcaoNova) {
  const totalRotacoes = 8; // Total de possibilidades de rotação
  const distanciaAngular = (direcaoNova - direcaoAtual + totalRotacoes) % totalRotacoes;
  const menorNumeroGiros = Math.min(distanciaAngular, totalRotacoes - distanciaAngular);

  let direcaoGiro;
  if (distanciaAngular <= totalRotacoes / 2) {
    direcaoGiro = DIREITA;
  } else {
    direcaoGiro = ESQUERDA;
  }

  return { menorNumeroGiros, direcaoGiro }
}

function imprimeCusto(cust) {
  console.table(DIRECOESTXT.map((d, index) => ({ direcao: d, custo: cust[index]})))
}

// se tiver um positivo, retorne o menor
// se só tiver negavito, retorne o maior
function encontrarNumero(array) {
  var menorPositivo = Infinity;
  var maiorNegativo = -Infinity;

  for (var i = 0; i < array.length; i++) {
    var numero = array[i];

    if (numero > 0 && numero < menorPositivo) {
      menorPositivo = numero;
    } else if (numero < 0 && numero > maiorNegativo) {
      maiorNegativo = numero;
    }
  }

  if (menorPositivo !== Infinity) {
    return menorPositivo;
  } else {
    return maiorNegativo;
  }
}

function buscaProfundidade(manual = false) {
  const cust = [];
  const mov = []

  for(const direcao of DIRECOES) {
    const { xNovo, yNovo } = calculaMovimento(direcao)
    if(checaObstaculo(xNovo, yNovo)) {
      cust.push(1000);
      mov.push({direcaoGiro: undefined, qntGiro: undefined})
      continue
    }

    const { direcaoGiro, menorNumeroGiros } = calcularMenorNumeroGiros(direcao);

    const custoBloco = matrixBlocos[xNovo][yNovo] > 0 ? 0 : -matrixBlocos[xNovo][yNovo];
    cust.push(menorNumeroGiros + 1 + custoBloco);
    mov.push({ direcaoGiro, qntGiro: menorNumeroGiros } )
  }

  if(manual) {
    imprimeCusto(cust);
  }
  
  const index = cust.indexOf(encontrarNumero(cust));
  const giro = mov[index];

  if(manual) {
    console.log(index);
    console.log(giro);
  }



  for(let i = 0; i < giro.qntGiro; i++) {
    girarRobo(giro.direcaoGiro);
  }
  moverRobo();
}

function loop() {
  buscaProfundidade();

  if(checaMeta(xRobo, yRobo)) {
    parar()
    alert('acabou')
  }
}

// 1 => direita
// -1 => esquerda
function girarRobo(movimento) {
  qntGiro += 1;

  switch (movimento) {
    case DIREITA: 
      direcaoAtual = (direcaoAtual + 1) % 8;
      break;
    case ESQUERDA:
      direcaoAtual = (direcaoAtual + 7) % 8;
      break;
  }

  const roboElement = document.querySelector(".robo");
  roboElement.style.transform = `rotate(${[(direcaoAtual) * 45]}deg)`;
}

let oldState = 0;
// robo se move somente para frente
function moverRobo() { 
  const { xNovo, yNovo } = calculaMovimento(direcaoAtual)

  if(checaObstaculo(xNovo, yNovo)) return;

  qntMovimento += 1;
    
  // salva a div do robo
  const robo = matrixDivs[xRobo][yRobo].childNodes[0];

  // vai adicionando custo no bloco que ele ja estava
  matrixBlocos[xRobo][yRobo] = oldState - 1;
  matrixDivs[xRobo][yRobo].className = 'bloco';
  matrixDivs[xRobo][yRobo].removeChild(robo)

  // move o robo
  xRobo = xNovo;
  yRobo = yNovo;

  // atualiza a div onde o robo está
  oldState = matrixBlocos[xRobo][yRobo];

  matrixBlocos[xRobo][yRobo] = 1;
  matrixDivs[xRobo][yRobo].classList.add('bloco-robo');
  matrixDivs[xRobo][yRobo].appendChild(robo)
}

function configurarJogo() {
  main();

  custoAtual = 0;
  xRobo = 0
  yRobo = 0


  // configura o robo inciial
  matrixBlocos[xRobo][yRobo] = 1
  matrixDivs[xRobo][yRobo].className = 'bloco'
  matrixDivs[xRobo][yRobo].classList.add('bloco-robo')
  const robo = document.createElement('div');
  robo.classList.add('robo');
  matrixDivs[xRobo][yRobo].appendChild(robo);

  
  for (let i = 0; i < tamanhoGrid; i++) {
    for (let j = 0; j < tamanhoGrid; j++) {
      if(i === xRobo && j === yRobo) continue;
      if(i === xMeta && j === yMeta) continue;

      matrixBlocos[i][j] = 0
      matrixDivs[i][j].className = 'bloco'

      if (Math.random() < 0.2 ) {
        matrixBlocos[i][j] = 2;
        matrixDivs[i][j].classList.add('bloco-obstaculo');
      }
    }
  }

  matrixBlocos[xMeta][yMeta] = 3;
  matrixDivs[xMeta][yMeta].classList.add('bloco-meta')
}

function main() {
  const mainDiv = document.querySelector('#main');
  // deixa em branco a main div
  mainDiv.innerHTML = ''

  // configura o estilo da grid
  mainDiv.style.gridTemplateColumns = `repeat(${tamanhoGrid}, 1fr)` 
  mainDiv.style.gridTemplateRows = `repeat(${tamanhoGrid}, 1fr)` 

  // apaga antigo jogo
  matrixBlocos = [];
  matrixDivs = [];

  // cria a grid e salva os status nos arrays blocoStatus e divs
  for (let i = 0; i < tamanhoGrid; i++) {
    matrixBlocos[i] = [];
    matrixDivs[i] = []
    for (let j = 0; j < tamanhoGrid; j++) {
      const bloco = document.createElement('div');

      bloco.classList.add('bloco');

      mainDiv.appendChild(bloco);

      matrixBlocos[i][j] = 0;
      matrixDivs[i][j] = bloco;
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  main()
})

document.addEventListener('keydown', function(event) {
  if (event.code === 'KeyW') moverRobo()

  if (event.code === 'KeyQ') girarRobo(ESQUERDA)
  
  if (event.code === 'KeyE') girarRobo(DIREITA) 

  if (event.code === 'KeyP') buscaProfundidade(true);
});
