// 0 é vazio 
// 1 é o robo
// 2 é o obstaculo
// 3 é a meta
const blocoEstado = [];
const divs = [];

const delayMovimento = 1000; // 1 segundo

const tamanhoGrid = 10;

let xRobo = 0;
let yRobo = 0;

//0 = norte
//1 = nordeste
//2 = leste
//3 = sudeste
//4 = sul
//5 = sudoeste
//6 = oeste
//7 = noroeste

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
    timer = setInterval(loop, delayMovimento)
  }
}

function parar() {
  if(timer) {
    clearInterval(timer)
  }
}

function loop() {
  if(checaMeta(xRobo, yRobo)) alert('acabou')
}

// 1 => direita
// -1 => esquerda
function girarRobo(movimento) {
  const novaDirecao = direcaoAtual + movimento;

  if(novaDirecao < 0) direcaoAtual = 7;
  else if(novaDirecao > 7) direcaoAtual = 0;
  else direcaoAtual = novaDirecao

  const roboElement = document.querySelector(".bloco-robo");
  roboElement.style.transform = `rotate(${[(direcaoAtual + 1) * 45]}deg)`;

  
}

function checaObstaculo(x, y) {
  // se não existir bloco ali ou se for um do tipo 2 (obstaculo)
  return blocoEstado[x] === undefined 
    || blocoEstado[x][y] === undefined 
    || blocoEstado[x][y] === 2
}

function checaMeta(x, y) {
  return blocoEstado[x][y] === 3
}

// x + 1 = para cima
// x - 1 = para esquerda
// y + 1 = para direita
// y - 1 = para esquerda
function moverRobo(x, y) {
  const novoX = xRobo + x;
  const novoY = yRobo + y;
  
  if(checaObstaculo(novoX, novoY)) return;


  blocoEstado[xRobo][yRobo] = 0;
  divs[xRobo][yRobo].className = 'bloco';

  xRobo = novoX;
  yRobo = novoY;

  divs[xRobo][yRobo].classList.add('bloco-robo');

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

document.addEventListener('keydown', function(event) {
  if (event.code === 'KeyW') moverRobo(-1, 0)

  if (event.code === 'KeyS') moverRobo(1, 0)

  if (event.code === 'KeyA') moverRobo(0, -1)

  if (event.code === 'KeyD') moverRobo(0, 1)

  if (event.code === 'KeyQ') girarRobo(1)
  
  if (event.code === 'KeyE') girarRobo(-1) 
});