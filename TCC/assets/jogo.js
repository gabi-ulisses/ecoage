const canvas = document.getElementById("jogoCanvas");
const ctx = canvas.getContext("2d");

// Variáveis do jogo
let frames = 0;
const gravidade = 0.25;
const personagem = {
    x: 50,
    y: canvas.height / 2,
    width: 90,
    height: 90,
    velocidade: 0,
    pulo: 4.6,
    atualizar() {
        this.velocidade += gravidade;
        this.y += this.velocidade;
    },
    desenhar() {
        const imagemPersonagem = new Image();
        imagemPersonagem.src = '../assets/personagem.png';
        ctx.drawImage(imagemPersonagem, this.x, this.y, this.width, this.height);
    },
};

// Função de atualização do jogo
function atualizarJogo() {
    frames++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    personagem.atualizar();
    personagem.desenhar();
    requestAnimationFrame(atualizarJogo);
}

const tubos = {
    width: 80,
    espaco: 200,
    maxHeight: canvas.height / 2,
    minHeight: 100,
    velocidade: 2,
    list: [],
    atualizar() {
        if (frames % 100 === 0) {
            const height = Math.floor(Math.random() * (this.maxHeight - this.minHeight) + this.minHeight);
            this.list.push({
                x: canvas.width,
                y: 0,
                height,
            });
            this.list.push({
                x: canvas.width,
                y: height + this.espaco,
                height: canvas.height - height - this.espaco,
            });
            
            const existeCarretel = Math.random() < 0.5;
            if (existeCarretel) {
                carreteis.list.push({
                    x: canvas.width,
                    y: height + this.espaco / 2 - carreteis.height / 2,
                    width: carreteis.width,
                    height: carreteis.height,
                });
            }
        }

        for (const tubo of this.list) {
            tubo.x -= this.velocidade;
            if (tubo.x + this.width < 0) this.list.shift();
        }
    },
    desenhar() {
        const imagemTubo = new Image();
        imagemTubo.src = '../assets/tubo.png';
        for (const tubo of this.list) {
          ctx.save(); // Salva o estado atual do contexto
          if (tubo.y === 0) {
            // Inverte a imagem verticalmente se o tubo estiver no topo
            ctx.scale(1, -1);
            ctx.drawImage(imagemTubo, tubo.x, -tubo.y - tubo.height, this.width, tubo.height);
          } else {
            ctx.drawImage(imagemTubo, tubo.x, tubo.y, this.width, tubo.height);
          }
          ctx.restore(); // Restaura o estado anterior do contexto
        }
    },
};

const carreteis = {
  width: 40,
  height: 40,
  list: [],
  
  atualizar() {
      for (const carretel of this.list) {
          carretel.x -= tubos.velocidade;
          if (carretel.x + this.width < 0) this.list.shift();
      }
  },
  desenhar() {
      const imagemCarretel = new Image();
      imagemCarretel.src = '../assets/carretel.png';
      
      // Calcular o deslocamento horizontal necessário para centralizar os carretéis
      const deslocamentoHorizontal = (tubos.width - this.width) / 2;

      for (const carretel of this.list) {
          // Definir a posição x do carretel com o deslocamento horizontal
          const x = carretel.x + deslocamentoHorizontal;
          
          ctx.drawImage(imagemCarretel, x, carretel.y, this.width, this.height);
      }
  },
};


let carreteisColetados = 0;
let tempoInicial = null; // Variável para armazenar o tempo de início
let tempoDecorrido = 0; // Variável para armazenar o tempo decorrido em segundos
let jogoFinalizado = false; // Variável de controle para verificar se o jogo finalizou
let tempoPausado = 0; // Variável para armazenar o tempo pausado


// função para ver se ocorreu uma colisão entre o personagem e o tubo

function collision(personagem, tubo) {
    return personagem.x < tubo.x + tubos.width &&
        personagem.x + personagem.width > tubo.x &&
        personagem.y < tubo.y + tubo.height &&
        personagem.y + personagem.height > tubo.y;
}


function detectCollisions() {
    for (const tubo of tubos.list) {
        if (collision(personagem, tubo)) {
            return true;
        }
    }
    for (const carretel of carreteis.list) {
        if (collision(personagem, carretel)) { // se ocorrer uma "colisão" entre o personagem e o carretel,retorna true e adiciona a pontuação de carreteis coletados
            carreteisColetados++;
            const index = carreteis.list.indexOf(carretel);
            carreteis.list.splice(index, 1); // remove o carretel com o indice correto apenas 1 vez
        }
    }

    return personagem.y <= 0 || personagem.y + personagem.height >= canvas.height;
}


function desenharPontuacao() {
    //quadrado branco atrás do relógio
    ctx.fillStyle = "white";
    ctx.fillRect(800, 0, -120, 65);

    // Desenhar imagem de um carretel
    const carretelImg = new Image();
    carretelImg.src = "../assets/carretel.png";
    ctx.drawImage(carretelImg, 10, 10, 20, 20);

    // Desenhar imagem de um relógio
    const relogioImg = new Image();
    relogioImg.src = "../assets/relogio.png";
    ctx.drawImage(relogioImg, 750, 15, 40, 40);

    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`${carreteisColetados}`, 40, 30);
    ctx.fillText(`${formatarTempo(tempoDecorrido)}`, 700, 45);

    function pausarTempo() {
        if (!jogoFinalizado && tempoInicial) { // jogoFinalizado é falso, tempoInicial não é nulo, garante que o tempo só será pausado se o jogo estiver em andamento
            tempoPausado = performance.now() - tempoInicial; //tempo percorrido até a pausa , performance.now() retorna o tempo atual,  ex: 10-0 = 10 segundos
            jogoFinalizado = true; //jogo finalizado
        }
    }
}


function formatarTempo(tempo) {
  const minutos = Math.floor((tempo % 3600) / 60);
  const segundos = tempo % 60;

  const formatoMinutos = minutos.toString().padStart(2, '0');
  const formatoSegundos = segundos.toString().padStart(2, '0');

  return `${formatoMinutos}:${formatoSegundos}`;
}

function atualizarTempoDecorrido(timestamp) {
  if (!tempoInicial) tempoInicial = timestamp - tempoPausado;

  const tempoPassado = Math.floor((timestamp - tempoInicial) / 1000); // Calcula o tempo passado em segundos
  tempoDecorrido = tempoPassado;

  if (!jogoFinalizado) {
    requestAnimationFrame(atualizarTempoDecorrido);
  }
}

requestAnimationFrame(atualizarTempoDecorrido);

let keys = {};
const SPACE_BAR_KEY_CODE = 32; // Código da tecla de espaço
const UP_ARROW_KEY_CODE = 38; // Código da seta para cima

// Adicione o evento de teclado global para capturar as teclas pressionadas
window.addEventListener("keydown", (event) => {
  keys[event.keyCode] = true;

  // Verifique se o evento ocorreu dentro do canvas do jogo antes de executar a ação de pulo
  if (canvas && ([SPACE_BAR_KEY_CODE, UP_ARROW_KEY_CODE].includes(event.keyCode))) {
    event.preventDefault();
    personagem.velocidade = -personagem.pulo;
  }
});

window.addEventListener("keyup", (event) => {
  delete keys[event.keyCode];
});



function gameLoop() {
    
    ctx.font = "40px Arial";
    ctx.fillStyle = "#8614e9";
    const titleText = "Guess the Tissue";
    const titleX = canvas.width / 2 - ctx.measureText(titleText).width / 2;
    const titleY = canvas.height / 2 - 20;
    ctx.fillText(titleText, titleX, titleY);
    
    const buttonWidth = 300;
    const buttonHeight = 50;
    const buttonX = canvas.width / 2 - buttonWidth / 2;
    const buttonY = canvas.height / 2 + 110;
    
    ctx.fillStyle = "#8614e9";
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    const buttonText = "Iniciar jogo";
    const buttonTextX = buttonX + buttonWidth / 2 - ctx.measureText(buttonText).width / 2;
    const buttonTextY = buttonY + buttonHeight / 2 + 10;
    ctx.fillText(buttonText, buttonTextX, buttonTextY);
    
    canvas.addEventListener("click", handleClick);
    
    function handleClick(event) {
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;
    
      if (
        clickX >= buttonX &&
        clickX <= buttonX + buttonWidth &&
        clickY >= buttonY &&
        clickY <= buttonY + buttonHeight
      ) {
        canvas.removeEventListener("click", handleClick);
        startGameLoop();
      }
    }
}
  
  function startGameLoop() {    
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    personagem.atualizar();
    tubos.atualizar();
    carreteis.atualizar();
  
  
    personagem.desenhar();
    tubos.desenhar();
    carreteis.desenhar();
    desenharPontuacao();
  
    if (keys[SPACE_BAR_KEY_CODE] || keys[UP_ARROW_KEY_CODE]) {
      personagem.velocidade = -personagem.pulo;
    }
  
    const colisaoComTubo = detectCollisions();
    if (colisaoComTubo) {
      gameOver();
      return;
    }
  
    for (const carretel of carreteis.list) {
      if (collision(personagem, carretel)) {
        carreteisColetados++;
        const index = carreteis.list.indexOf(carretel);
        carreteis.list.splice(index, 1);
      }
    }
  
    frames++;
    requestAnimationFrame(startGameLoop);
  }

  

  
    /*if (frames == 0) {
      Swal.fire({ 
        title: "Inicio de jogo!",  
        icon: "success",
        html: 
          "<img src='../assets/nois.png' width='200' height='200'>" +
          "<br>",  
        confirmButtonColor: '#8614e9',
        confirmButtonText: 'Iniciar',
        allowOutsideClick: true,
        allowEscapeKey: true
      }).then((result) => {
        if (result.isConfirmed) {
          startGameLoop();
        }
      });
    } else {
      startGameLoop();
    }
  } */
  
    

function gameOver() {
    Swal.fire({ 
      title: "Fim de jogo!",  
      icon: "success",
      html: 
        "<img src='../assets/nois.png' width='200' height='200'>" +
        "<p>Carretéis coletados: " + carreteisColetados + "</p>" +
        "<p>Tempo decorrido: " + formatarTempo(tempoDecorrido) + "</p>" +
        "<br>",  
      confirmButtonColor: '#8614e9',
      showCancelButton: false,
      confirmButtonText: 'Jogar Novamente',
      allowOutsideClick: false,
      allowEscapeKey: false
    })
      .then((result) => {
        if (result.value) {
          restartGame();
        }
      });
  }
  
function restartGame() {
        
    frames = 0;
    personagem.y = canvas.height / 2;
    personagem.velocidade = 0;
    tubos.list = [];
    carreteis.list = [];
    carreteisColetados = 0;
    tempoDecorrido = 0;
    tempoInicial = null;

    startGameLoop(); 
 }

    function atualizartempoDecorrido() {
    tempoDecorrido++;
    setTimeout(atualizartempoDecorrido, 1000);
} 

gameLoop();

