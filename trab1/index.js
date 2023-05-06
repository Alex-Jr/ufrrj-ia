// 0 é vazio 
// 1 é o jogador
// 2 é o obstaculo
// 3 é a meta
const tamanho = 10;

const blockStatus = [];
const divs = [];

const xJogador = 0;
const yJogador = 0;

const xMeta = tamanho - 1;
const yMeta = tamanho - 1;

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
  blockStatus[0][0] = 1
  divs[0][0].classList.add('block-player')

  for (let i = 0; i < tamanho; i++) {
    for (let j = 0; j < tamanho; j++) {
      if(i === xJogador && j === yJogador) continue;
      if(i === xMeta && j === yMeta) continue;

      divs[i][j].className = 'block'

      if (Math.random() < 0.2 ) {
        blockStatus[i][j] = 2;
        divs[i][j].classList.add('block-obstacle');
      }
    }
  }

  blockStatus[xMeta][yMeta] = 3;
  divs[xMeta][yMeta].classList.add('block-target')
}

function main() {
  const container = document.querySelector('#main');

  // configura o estilo da grid
  container.style.gridTemplateColumns = `repeat(${tamanho}, 1fr)` 
  container.style.gridTemplateRows = `repeat(${tamanho}, 1fr)` 

  // cria a grid e salva os status nos arrays blockStatus e divs
  for (let i = 0; i < tamanho; i++) {
    const rowStatus = []
    const rowDivs = []
    for (let j = 0; j < tamanho; j++) {
      rowStatus.push(0);
      const block = document.createElement('div');

      block.classList.add('block');

      container.appendChild(block);
      rowDivs.push(block)
    }
    blockStatus.push(rowStatus)
    divs.push(rowDivs)
  }
}

document.addEventListener('DOMContentLoaded', function() {
  main()
})