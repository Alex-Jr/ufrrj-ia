// Função para gerar números aleatórios
const randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomFloat = () => {
    return Math.random()
}

// Parâmetros da da mochila
const capacidadeMochila = 150;
const itens = [
  { nome: 'Item 1', peso: 13, valor: 100 },
  { nome: 'Item 2', peso: 18, valor: 50 },
  { nome: 'Item 3', peso: 26, valor: 75 },
  { nome: 'Item 4', peso: 39, valor: 120 },
  { nome: 'Item 5', peso: 48, valor: 145 },
  { nome: 'Item 6', peso: 22, valor: 63 },
  { nome: 'Item 7', peso: 63, valor: 36 },
  { nome: 'Item 8', peso: 29, valor: 16 },
  { nome: 'Item 9', peso: 16, valor: 18 },
  { nome: 'Item 10', peso: 36, valor: 73 }
];

// Parâmetros do algoritmo genético
const tamanhoPopulacao = 50;
const taxaMutacao = 0.03;
const numeroGeracoes = 50;

// Função de fitness de um indivíduo
function fitness(individuo) {
  let pesoTotal = 0;
  let valorTotal = 0;
  
  for (let i = 0; i < individuo.length; i++) {
    if (individuo[i] === 1) {
      pesoTotal += itens[i].peso;
      valorTotal += itens[i].valor;
    }
  }
  
  if (pesoTotal > capacidadeMochila) {
    valorTotal = 0;
  }
  
  return valorTotal;
}

// Função para criar um indivíduo aleatório
function criarIndividuo() {
  const individuo = [];
  
  for (let i = 0; i < itens.length; i++) {
    individuo.push(randomInt(0, 1));
  }
  
  return individuo;
}

// Função para criar a população inicial
function criarPopulacao() {
  const populacao = [];
  
  for (let i = 0; i < tamanhoPopulacao; i++) {
    populacao.push(criarIndividuo());
  }
  
  return populacao;
}

// Função para selecionar os melhores indivíduos (torneio binário)
function selecionarIndividuos(populacao) {
  const individuosSelecionados = [];
  
  for (let i = 0; i < tamanhoPopulacao; i++) {
    const indice1 = randomInt(0, tamanhoPopulacao - 1);
    const indice2 = randomInt(0, tamanhoPopulacao - 1);
    
    const individuo1 = populacao[indice1];
    const individuo2 = populacao[indice2];
    
    const fitness1 = fitness(individuo1);
    const fitness2 = fitness(individuo2);
    
    if (fitness1 >= fitness2) {
      individuosSelecionados.push(individuo1);
    } else {
      individuosSelecionados.push(individuo2);
    }
  }
  
  return individuosSelecionados;
}

// Função para realizar o crossover (reprodução) entre dois indivíduos
function crossover(individuo1, individuo2) {
  const filho1 = [];
  const filho2 = [];
  
  const pontoCorte = randomInt(1, itens.length - 1);
  
  for (let i = 0; i < pontoCorte; i++) {
    filho1.push(individuo1[i]);
    filho2.push(individuo2[i]);
  }
  
  for (let i = pontoCorte; i < itens.length; i++) {
    filho1.push(individuo2[i]);
    filho2.push(individuo1[i]);
  }
  
  return [filho1, filho2];
}

// Função para realizar a mutação em um indivíduo
function mutacao(individuo) {
  for (let i = 0; i < individuo.length; i++) {
    if (randomFloat() < taxaMutacao) {
      individuo[i] = 1 - individuo[i]; // Troca 0 por 1 e vice-versa
    }
  }
  
  return individuo;
}

// Função para executar o algoritmo genético
function executarAlgoritmoGenetico() {
  let populacao = criarPopulacao();
  
  for (let geracao = 0; geracao < numeroGeracoes; geracao++) {
    const novaPopulacao = [];
    
    for (let i = 0; i < tamanhoPopulacao; i++) {
      const individuosSelecionados = selecionarIndividuos(populacao);
      const individuo1 = individuosSelecionados.pop();
      const individuo2 = individuosSelecionados.pop();
      
      const [filho1, filho2] = crossover(individuo1, individuo2);
      
      novaPopulacao.push(mutacao(filho1));
      novaPopulacao.push(mutacao(filho2));
    }
    
    populacao = novaPopulacao;

    let melhorFitness = -1;
    let melhorIndividuo = null;
    
    // Encontrar o melhor indivíduo da geração
    for (let i = 0; i < tamanhoPopulacao; i++) {
      const individuo = populacao[i];
      const fitnessAtual = fitness(individuo);
      
      if (fitnessAtual > melhorFitness) {
        melhorFitness = fitnessAtual;
        melhorIndividuo = individuo;
      }
    }
    // Imprimir o resultado
    console.log(`${geracao + 1}: ${melhorIndividuo} - ${melhorFitness}`);
  }
}

// Executar o algoritmo genético
executarAlgoritmoGenetico();
