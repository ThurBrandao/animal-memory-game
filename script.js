const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Bancada de Imagens
const items = [
  { name: "abelha", image: "abelha.png" },
  { name: "crocodilo", image: "crocodilo.png" },
  { name: "papagaio", image: "papagaio.png" },
  { name: "gorila", image: "gorila.png" },
  { name: "tigre", image: "tigre.png" },
  { name: "macaco", image: "macaco.png" },
  { name: "camaleão", image: "camaleão.png" },
  { name: "peixe", image: "peixe.png" },
  { name: "cobra", image: "cobra.png" },
  { name: "bicho-preguiça", image: "bicho-preguiça.png" },
  { name: "cacatua", image: "cacatua.png" },
  { name: "tucano", image: "tucano.png" },
];

//Tempo Inicial
let seconds = 0,
  minutes = 0;
//Movimentos iniciais e contagem de vitórias
let movesCount = 0,
  winCount = 0;

//Temporizador
const timeGenerator = () => {
  seconds += 1;
  //lógica de minutos
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //formatar hora antes de exibir
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Tempo:</span>${minutesValue}:${secondsValue}`;
};

//Calcular Movimentos
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Movimentos:</span>${movesCount}`;
};

//Escolha de objetos aleatórios da bancada de imagens
const generateRandom = (size = 4) => {
  //imagem temporária
  let tempArray = [...items];
  //inicializa cardValues em imagens
  let cardValues = [];
  //o tamanho deve ser duplo (imagem 4*4)/2, pois existiriam pares de objetos
  size = (size * size) / 2;
  //Seleção aleatória de objetos
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    //uma vez selecionado, remova o objeto da imagem temporária
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  //embaralhamento simples
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    /*
        Criar cartões
        antes => frente (contém ponto de interrogação)
        depois => verso (contém imagem real);
        data-card-values ​​é um atributo personalizado que armazena os nomes dos cartões para corresponder mais tarde
      */
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  //Grade
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  //Cartões
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //Se a carta selecionada ainda não for correspondida, então execute somente (ou seja, a carta já correspondida quando clicada seria ignorada)
      if (!card.classList.contains("matched")) {
        //Virar a carta clicada
        card.classList.add("flipped");
        //se for a primeira carta (!firstCard já que firstCard é inicialmente falso)
        if (!firstCard) {
          //então o cartão atual se tornará o primeiro cartão
          firstCard = card;
          //o valor atual do cartão se torna firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          //incremento move desde que o usuário selecionou a segunda carta
          movesCounter();
          //secondCard and value
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //se ambas as cartas forem iguais, adicione a classe correspondente para que essas cartas sejam ignoradas na próxima vez
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            //defina firstCard como falso, pois a próxima carta seria a primeira agora
            firstCard = false;
            //incremento winCount conforme o usuário encontra uma correspondência correta
            winCount += 1;
            //verifique se winCount ==metade de cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>Você conseguiu! Parabéns</h2>
            <h4>Movimentos: ${movesCount}</h4>`;
              stopGame();
            }
          } else {
            //se as cartas não combinam
            //vire as cartas de volta ao normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

//Iniciar jogo
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //controla a visibilidade dos botões
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  //Iniciar cronômetro
  interval = setInterval(timeGenerator, 1000);
  //Movimentos iniciais
  moves.innerHTML = `<span>Movimentos:</span> ${movesCount}`;
  initializer();
});

//Pare o jogo
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

//Inicializar valores e chamadas de função
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};
