// -1 é que ja passou, mas quanto menor é a quantidade de vezes que ja passou lá
// 0 é vazio 
// 1 é o robo
// 2 é o obstaculo
// 3 é a meta
let matrixBlocos = [];
let matrixDivs = [];

const delayMovimento = 50; // 1 segundo

const tamanhoGrid = 15;

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
    timer = undefined;
  }
}

function checaObstaculo(x, y) {
  // se não existir bloco ali ou se for um do tipo 2 (obstaculo)
  return matrixBlocos[x] === undefined 
    || matrixBlocos[x][y] === undefined 
    || matrixBlocos[x][y] === 2
}

// mover sobreescreve a meta, então eu tenho que checar assim
function checaMeta(x, y) {
  return x === xMeta && y === yMeta
}

function calculaMovimento(direcao) {
  let yNovo = 0;
  let xNovo = 0;

  switch (direcao) {
    case NORTE:
      xNovo = xRobo - 1;
      yNovo = yRobo;
      break;
    case NORDESTE:
      xNovo = xRobo - 1;
      yNovo = yRobo + 1;
      break;
    case LESTE:
      xNovo = xRobo;
      yNovo = yRobo + 1;
      break;
    case SUDESTE:
      xNovo = xRobo + 1;
      yNovo = yRobo + 1;
      break;
    case SUL:
      xNovo = xRobo + 1;
      yNovo = yRobo;
      break;
    case SUDOESTE:
      xNovo = xRobo + 1;
      yNovo = yRobo - 1;
      break;
    case OESTE:
      xNovo = xRobo;
      yNovo = yRobo - 1;
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

// retorna a melhor maneira de girar para uma posição
function calcularMenorNumeroGiros(direcaoNova) {
  // Total de possibilidades de rotação
  const totalRotacoes = 8; 
  // calcula a distancia angular para onde queremos chegar
  const distanciaAngular = (direcaoNova - direcaoAtual + totalRotacoes) % totalRotacoes;
  // verifica qual é a melhor maneira, pois podemos girar de ambos os lados
  const menorNumeroGiros = Math.min(distanciaAngular, totalRotacoes - distanciaAngular);

  let direcaoGiro;
  // se for maior que girar metade, usa o outro lado
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

  // calcula o custo de cada movimento
  for(const direcao of DIRECOES) {
    // verifica como chegamos lá
    const { xNovo, yNovo } = calculaMovimento(direcao)

    // verifica se tem um obstaculo, ou seja não podemos ir para lá
    if(checaObstaculo(xNovo, yNovo)) {
      cust.push(1000);
      mov.push({direcaoGiro: undefined, qntGiro: undefined})
      continue
    }

    // acha a melhor maneira de girar para essa direção específica
    const { direcaoGiro, menorNumeroGiros } = calcularMenorNumeroGiros(direcao);

    // adiciona o custo do bloco atual
    // quando é menor que 0 quer dizer que ja estivemos nesse bloco
    // cada vez que passamos lá denovo adiciona mais um de custo
    const custoBloco = matrixBlocos[xNovo][yNovo] > 0 ? 0 : -matrixBlocos[xNovo][yNovo];

    // custo de girar + custo de andar + penalidade de ja ter passado lá
    cust.push(menorNumeroGiros + 1 + custoBloco);

    // salva a maneira para girar, pois aidna não decidimos como vamos se movimentar
    mov.push({ direcaoGiro, qntGiro: menorNumeroGiros } )
  }

  if(manual) {
    imprimeCusto(cust);
  }
  
  // acha a posição que queremos escolher
  const index = cust.indexOf(encontrarNumero(cust));
  // acha como temos que girar
  const giro = mov[index];

  if(manual) {
    console.log(index);
    console.log(giro);
  }

  // gira o necessário
  for(let i = 0; i < giro.qntGiro; i++) {
    girarRobo(giro.direcaoGiro);
  }

  // se move para frente
  moverRobo();
}

// isso irá rodar a cada execução
function loop() {
  buscaProfundidade();

  if(checaMeta(xRobo, yRobo)) {
    parar()
  }
}

// 1 => direita
// -1 => esquerda
function girarRobo(movimento) {
  qntGiro += 1;

  // isso garante que o robo se mova de  7 -> 0 ou de 0 -> 7
  switch (movimento) {
    case DIREITA: 
      direcaoAtual = (direcaoAtual + 1) % 8;
      break;
    case ESQUERDA:
      direcaoAtual = (direcaoAtual + 7) % 8;
      break;
  }

  // atualiza visualmente como o robo está virado
  const roboElement = document.querySelector(".robo");
  roboElement.style.transform = `rotate(${[(direcaoAtual) * 45]}deg)`;
}

let antigoValor = 0;
// robo se move somente para frente
function moverRobo(manual = false) { 
  // calcula para onde vamos se mover
  const { xNovo, yNovo } = calculaMovimento(direcaoAtual)

  if(manual) {
    console.log('x', xNovo, 'y', yNovo); 
  }

  // calcula se pode se mover para lá
  if(checaObstaculo(xNovo, yNovo)) return;

  qntMovimento += 1;
    
  // salva a div do robo
  const robo = matrixDivs[xRobo][yRobo].childNodes[0];

  // blocos que o robo já passou tem seu custo aumentado
  matrixBlocos[xRobo][yRobo] = antigoValor - 1;
  matrixDivs[xRobo][yRobo].innerText = String(antigoValor - 1).replace('-', '');
  matrixDivs[xRobo][yRobo].className = 'bloco';

  // move o robo
  xRobo = xNovo;
  yRobo = yNovo;

  // como a posição atual do robo sobreescreve o valor antigo do bloco
  // salvamos ele na variavel antigoValor
  antigoValor = matrixBlocos[xRobo][yRobo];

  // mostra visualmente e logicamente onde o robo está
  matrixBlocos[xRobo][yRobo] = 1;
  matrixDivs[xRobo][yRobo].innerText = '';
  matrixDivs[xRobo][yRobo].classList.add('bloco-robo');
  matrixDivs[xRobo][yRobo].appendChild(robo)

  if(manual) {
    console.log(checaMeta(xRobo, yRobo));
  }
}

function configurar() {
  const tamanho = tamanhoGrid;
  parar()

  // GRID 
  const mainDiv = document.querySelector('#main');
  // apaga antigo setup
  mainDiv.innerHTML = ''
  matrixBlocos = [];
  matrixDivs = [];

  // configura o estilo da grid
  mainDiv.style.gridTemplateColumns = `repeat(${tamanho}, 1fr)` 
  mainDiv.style.gridTemplateRows = `repeat(${tamanho}, 1fr)` 

  // cria a grid e salva os status nos arrays blocoStatus e divs
  for (let i = 0; i < tamanho; i++) {
    matrixBlocos[i] = [];
    matrixDivs[i] = []
    for (let j = 0; j < tamanho; j++) {
      const bloco = document.createElement('div');

      bloco.classList.add('bloco');

      mainDiv.appendChild(bloco);

      matrixBlocos[i][j] = 0;
      matrixDivs[i][j] = bloco;
    }
  }

  // ROBO, METAS E OBSTACULOS
  custoAtual = 0;
  xRobo = 0
  yRobo = 0

  // cria a div do robo
  matrixBlocos[xRobo][yRobo] = 1
  matrixDivs[xRobo][yRobo].className = 'bloco'
  matrixDivs[xRobo][yRobo].classList.add('bloco-robo')

  // cria o robo em si
  const robo = document.createElement('div');
  robo.classList.add('robo');
  matrixDivs[xRobo][yRobo].appendChild(robo);

  
  // cria a meta
  matrixBlocos[xMeta][yMeta] = 3;
  matrixDivs[xMeta][yMeta].classList.add('bloco-meta')

  
  // Configurar obstaculos
  for (let i = 0; i < tamanhoGrid; i++) {
    for (let j = 0; j < tamanhoGrid; j++) {
      // não pode ser no robo
      if(i === xRobo && j === yRobo) continue;
      // não pode ser na meta
      if(i === xMeta && j === yMeta) continue;

      matrixBlocos[i][j] = 0
      matrixDivs[i][j].className = 'bloco'

      // 0.2% de chance de haver um obstaculo
      // isso pode gerar caminhos impossíveis por aleatoriedade
      if (Math.random() < 0.2 ) {
        matrixBlocos[i][j] = 2;
        matrixDivs[i][j].classList.add('bloco-obstaculo');
      }
    }
  }
}


document.addEventListener('DOMContentLoaded', function() {
  configurar()
})

document.addEventListener('keydown', function(event) {
  if (event.code === 'KeyW') moverRobo(true)

  if (event.code === 'KeyQ') girarRobo(ESQUERDA)
  
  if (event.code === 'KeyE') girarRobo(DIREITA) 

  if (event.code === 'KeyP') buscaProfundidade(true);
});
