// 0 é vazio 
// 1 é o robo
// 2 é o obstaculo
// 3 é a meta
const blocoEstado = [];
const divs = [];

const tamanhoGrid = 10;

let xRobo = 0;
let yRobo = 0;

//0 = norte
//1 = leste
//2 = sul
//3 = oeste
let direcaoAtual = 0

const xMeta = tamanhoGrid - 1;
const yMeta = tamanhoGrid - 1;

const custos = {
  parado: 1000,
  bater: 1000,
  girar: 1,
  andar: 0,
};

let custoAtual = 0;

let timer;


function começar() {
  if(!timer) {
    timer = setInterval(loop, 1000)
  }
}

function parar() {
  if(timer) {
    clearInterval(timer)
  }
}

function loop() {
  console.log('a')
}

function configurarJogo() {
  blocoEstado[0][0] = 1
  divs[0][0].className = 'bloco'
  divs[0][0].classList.add('bloco-robo')
  custoAtual = 0;
  xRobo = 0
  yRobo = 0

  for (let i = 0; i < tamanhoGrid; i++) {
    for (let j = 0; j < tamanhoGrid; j++) {
      if(i === xRobo && j === yRobo) continue;
      if(i === xMeta && j === yMeta) continue;

      blocoEstado[i][j] = 0
      divs[i][j].className = 'bloco'

      if (Math.random() < 0.2 ) {
        blocoEstado[i][j] = 2;
        divs[i][j].classList.add('bloco-obstaculo');
      }
    }
  }

  blocoEstado[xMeta][yMeta] = 3;
  divs[xMeta][yMeta].classList.add('bloco-meta')
}

function main() {
  const mainDiv = document.querySelector('#main');

  // configura o estilo da grid
  mainDiv.style.gridTemplateColumns = `repeat(${tamanhoGrid}, 1fr)` 
  mainDiv.style.gridTemplateRows = `repeat(${tamanhoGrid}, 1fr)` 

  // cria a grid e salva os status nos arrays blocoStatus e divs
  for (let i = 0; i < tamanhoGrid; i++) {
    const linhaEstado = []
    const linhaDivs = []
    for (let j = 0; j < tamanhoGrid; j++) {
      linhaEstado.push(0);
      const bloco = document.createElement('div');

      bloco.classList.add('bloco');

      mainDiv.appendChild(bloco);
      linhaDivs.push(bloco)
    }
    blocoEstado.push(linhaEstado)
    divs.push(linhaDivs)
  }
}

document.addEventListener('DOMContentLoaded', function() {
  main()
})