document.addEventListener("DOMContentLoaded", function () {
    const elements = {
      popupPieces: document.getElementById("regular_popup"),
      sendButton: document.getElementById("send"),
      timerDisplay: document.querySelector(".timer"),
      tipNum: document.querySelector(".tipsNum"),
      tipImg: document.querySelector(".tip"),
      input: document.querySelector(".answer"),
    };
  
    const cellsDisplay = document.querySelectorAll(".cell");
    cellsDisplay.forEach((cell, index) => {
      cell.dataset.index = index;
    });
  
    const originalContent = [...cellsDisplay].map((cell) => cell.innerHTML);
  
    const challengeContents = JSON.parse(
      localStorage.getItem("challengeContents")
    );
   
  
    let gameState = {
      diceNum: 0,
      gameReady: false,
      previousCell: null,
      clickedCell: true,
      tip: false,
      hasShield: false,
      movingForward: true,
      blockedPath: true,
      timerInterval : null,
      gameTime: 0,
      
    };
  
    let user = {
      name: "",
      position: 0,
      piece: "",
      tips: 0,
      pieces: 0,
      shields: 0,
    };
  
    const path = [
      17, 18, 19, 20, 21, 16, 15, 14, 13, 12, 11, 6, 7, 8, 9, 10, 5, 4, 3, 2, 1,
      0,
    ].map((index, i) => ({
      index,
      order: i,
      element: cellsDisplay[index],
      state: "",
    }));
  
    function startTimer() {
      gameState.timerInterval = setInterval(() => {
        gameState.gameTime++;
        updateTimerDisplay();
      }, 1000);
    }
  
    function updateTimerDisplay() {
      const minutes = Math.floor(gameState.gameTime / 60);
      const seconds = gameState.gameTime % 60;
      elements.timerDisplay.textContent = `${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
    }
  
    function stopTimer() {
      clearInterval(gameState.timerInterval);
    }
  
    function startGame() {
      const goButton = document.querySelector(".go_button");
      const diceButton = document.querySelector(".dice_button");
      const availablePieces = document.querySelectorAll(".piece");
      const popup = document.getElementById("popup");
      const nameDisplay = document.querySelector(".board_name");
  
      popup.style.display = "block";
      availablePieces.forEach((piece) => {
        piece.addEventListener("click", () => {
          user.piece = piece.textContent;
          stylePiece(piece);
        });
      });
  
      goButton.addEventListener("click", () => {
        user.name = document.querySelector(".player_name").value;
        if (user.name && user.piece) {
          popup.style.display = "none";
          nameDisplay.textContent = `${user.name}'s Board`;
          gameState.gameReady = true;
          setFirstCell();
        }
      });
  
      diceButton.addEventListener("click", rollDice);
    }
  
    function stylePiece(piece) {
      piece.style.border = "3px solid #F39414";
      piece.style.borderRadius = "50%";
      piece.style.padding = "0px 2px";
    }
  
    function setFirstCell() {
      path[0].element.style.fontSize = "30px";
      path[0].element.textContent = user.piece;
      path[0].state = user.piece;
    }
  let done;
    function rollDice() {
      done=false;
      const numberDisplay = document.querySelector(".dice_number");
      if (!gameState.gameReady || !gameState.clickedCell) return;
  
      gameState.clickedCell = false;
      gameState.diceNum = getDiceRoll();
      numberDisplay.textContent = `Dice number: ${gameState.diceNum}`;
  
      let targetIndex;
  
      if (gameState.movingForward) {
        targetIndex = user.position + gameState.diceNum;
      } else {
        targetIndex = user.position - gameState.diceNum;
      }
  
      if (targetIndex >= path.length) {
        targetIndex = path.length - 1;
      } else if (targetIndex < 0) {
        targetIndex = 0;
      }
  
      if (targetIndex >= 16 && user.pieces < 3 && gameState.blockedPath) {
        gameState.movingForward = false;
  
        targetIndex = user.position - gameState.diceNum;
        changeRegularContent(
          "São necessárias três peças para desbloquear o caminho",
          "/codebuddy/Escape_room/Assets/lock_popup.png"
        );
      } else if (
        targetIndex === 0 &&
        !gameState.movingForward &&
        user.pieces < 3
      ) {
        gameState.movingForward = true;
        targetIndex = user.position + gameState.diceNum;
      } else if (targetIndex >= 21 && gameState.movingForward) {
        moveToFinalCell();
      }
  
      let showOption = path[targetIndex].element;
      styleCell(showOption, true);
      setupCellClick(showOption, targetIndex);
  
      if (gameState.gameTime === 0) {
        startTimer();
      }
    }
  
    function getDiceRoll() {
      const random = Math.random();
      if (random < 0.4) {
        return 1;
      } else if (random < 0.7) {
        return 2;
      } else if (random < 0.9) {
        return 3;
      } else if (random < 0.95) {
        return 4;
      } else if (random < 0.975) {
        return 5;
      } else {
        return 6;
      }
    }
  
    function styleCell(cell, highlight) {
      const style = highlight
        ? { boxShadow: "0 0 60px #B2FAF1", border: "3px solid #B2FAF1" }
        : { boxShadow: "none", border: "none" };
      Object.assign(cell.style, style);
    }
      function setupCellClick(cell, targetIndex) {
      const handleClick = () => {
        if (!gameState.clickedCell && cell === path[targetIndex].element) {
          gameState.clickedCell = true;
  
          if (gameState.previousCell) {
            resetCell(gameState.previousCell);
          }
  
          cell.innerHTML = user.piece;
          cell.style.fontSize = "30px";
          gameState.previousCell = cell;
          resetFirstCell();
          styleCell(cell, false);
  
          if (user.pieces >= 3 && !gameState.movingForward) {
            user.position = 16;
            gameState.movingForward = true;
            targetIndex = user.position + gameState.diceNum;
          } else {
            user.position = path[targetIndex].order;
            checkCellActions(targetIndex);
          }
        }
      };
  
      cell.addEventListener("click", handleClick, { once: true });
    }
  
    function resetCell(cell) {
      const originalIndex = cell.dataset.index;
      cell.innerHTML = originalContent[originalIndex];
      cell.style.fontSize = "50px";
    }
  
    function resetFirstCell() {
      const firstCell = path[0].element;
      firstCell.innerHTML = originalContent[firstCell.dataset.index];
      firstCell.style.fontSize = "50px";
    }
  
    function checkCellActions(index) {
      const shields = [3, 8, 14];
      const challenges = [2, 4, 6, 9, 11, 13, 15, 17, 19];
      const tips = [5, 10, 12];
  
      let content = selectRandomContent();
  
      if (shields.includes(index)) {
        shieldsHandler(index);
      } else if (challenges.includes(index)) {
        changeChallengeContent(content.question);
        checkAnswer(content.answer);
        openTip(content.tip);
      } else if (tips.includes(index)) {
        handleTipCell();
      }
    }
  
    function shieldsHandler() {
      let shieldsDisplay = document.querySelector(".shieldsNum");
      user.shields++;
      shieldsDisplay.innerHTML = user.shields;
      gameState.hasShield = true;
      changeRegularContent(
        "Recebeste um escudo, estás protegido de perder peças",
        `/codebuddy/Escape_room/Assets/shield_popup.png`
      );
    }
  
    function openPopupChallenge() {
      const popupChallenge = document.getElementById("popup_challenge");
      const closeChallenge = elements.sendButton;
      popupChallenge.style.display = "block";
      closeChallenge.addEventListener("click", () => {
        popupChallenge.style.display = "none";
      });
    }
  
    function changeChallengeContent(newQuestion) {
      let questionContent = document.querySelector(".question");
      questionContent.innerHTML = newQuestion;
      openPopupChallenge();
    }
  
    function openRegularPopup() {
      const popupPieces = document.getElementById("regular_popup");
      const closeButton = document.querySelector(".close_button");
      popupPieces.style.display = "block";
      closeButton.addEventListener("click", () => {
        popupPieces.style.display = "none";
      });
    }
  
    function changeRegularContent(newLabel, newImg) {
      let popupLabel = document.querySelector(".regular_content");
      const popupImg = document.querySelector(".popup_img");
      popupLabel.innerHTML = newLabel;
      popupImg.src = newImg;
  
      openRegularPopup();
    }
  
    function selectRandomContent() {
      let randomIndex = Math.floor(Math.random() * challengeContents.length);
      console.log(challengeContents);
      let selectedContent = challengeContents[randomIndex];
      return selectedContent;
    }
  
    function checkAnswer(correctAnswer) {
      elements.sendButton.addEventListener(
        "click",
        () => {
          const padlock = document.querySelector(".padlock");
          console.log('padlock', padlock);
          const userAnswer = elements.input.value.trim().toLowerCase();
          if (userAnswer !== "" && userAnswer === correctAnswer) {
            rightAnswer();
          } else if (user.pieces > 0 && gameState.hasShield) {
            protectByShields();
          } else if (user.pieces !== 0) {
            wrongAnswer();
            console.log(user.pieces, gameState.blockedPath);
          } 
          
          if (user.pieces === 3 && gameState.blockedPath) {
       
            moveToBlockCell();
            console.log('padlock', padlock);
            padlock.src = '/codebuddy/Escape_room/Assets/unlock_popup.png';
            console.log('change padlock', padlock)
            gameState.blockedPath = false;
          }
          elements.input.value = "";
        },
        { once: true }
      );
    }
  
    function rightAnswer() {
      const piecesNum = document.querySelector(".piecesNum");
      user.pieces++;
      piecesNum.innerHTML = user.pieces;
      changeRegularContent(
        "Acertaste na resposta e ganhaste uma peça",
        `/codebuddy/Escape_room/Assets/piece_popup.png`
      );
    }
  
    function wrongAnswer() {
      const piecesNum = document.querySelector(".piecesNum");
      user.pieces--;
      piecesNum.innerHTML = user.pieces;
      changeRegularContent(
        "Falhaste a resposta e perdeste uma peça ",
        `/codebuddy/Escape_room/Assets/sad_face.png`
      );
    }
  
    function protectByShields() {
      const shieldsNum = document.querySelector(".shieldsNum");
      user.shields--;
      shieldsNum.innerHTML = user.shields;
      changeRegularContent(
        "Falhaste a resposta mas como estavas protegido pelo escudo não perdeste peças",
        `/codebuddy/Escape_room/Assets/sad_face.png`
      );
      if (user.shields === 0) {
        gameState.hasShield = false;
      }
    }
    function handleTipCell() {
      changeRegularContent(
        "Recebeste uma dica para o próximo desafio",
        "/codebuddy/Escape_room/Assets/tip_popup.png"
      );
  
      user.tips++;
      elements.tipNum.innerHTML = user.tips;
      gameState.tip = true;
      elements.tipImg.src = "/codebuddy/Escape_room/Assets/tip_popup.png";
    }
    
    
  
    function openTip(selectedTip) {
      
      elements.tipImg.addEventListener(
        "click",
        () => {
          changeRegularContent(selectedTip, '/codebuddy/Escape_room/Assets/exclamation_point.png');
          if (user.tips > 0 && !done) {
            user.tips--;
            elements.tipNum.innerHTML = user.tips;
            done=true;
          } else {
            gameState.tip = false;
            elements.tipImg.src = "";
          }
        },
        { once: true }
      );
    }
  
    function moveToBlockCell() {
      changeRegularContent(
        "Desbloqueaste o caminho !",
        `/codebuddy/Escape_room/Assets/unlock_popup.png`
      );
      resetCell(path[user.position].element);
      user.position = 16;
      gameState.previousCell = path[16].element;
      path[16].element.innerHTML = user.piece;
      path[16].element.style.fontSize = "30px";
      styleCell(path[16].element, false);
      gameState.movingForward = true;
    }
  
    function moveToFinalCell() {
      resetCell(path[user.position].element);
      user.position = 21;
      gameState.previousCell = path[21].element;
      path[21].element.innerHTML = user.piece;
      path[21].element.style.fontSize = "30px";
      styleCell(path[21].element, false);
      setupCellClick(path[21].element, 21);
  
      stopTimer();
      showRaking();
    }
  
    function showRaking() {
      const minutes = Math.floor(gameState.gameTime / 60);
  
      if (minutes < 10) {
        changeRegularContent(
          "Concluiste o jogo em menos de 10 minutos e recebeste o troféu de primeiro lugar",
          "/codebuddy/Escape_room/Assets/first_trophy.png"
        );
      } else if ((minutes) => 10 && minutes <= 20) {
        changeRegularContent(
          "Ganhaste o troféu de segundo lugar pelo tempo que demoraste a concluir o jogo",
          "/codebuddy/Escape_room/Assets/second_trophy.png"
        );
      } else {
        changeRegularContent(
          "Concluiste o jogo e ganhaste o troféu de terceiro lugar",
          "/codebuddy/Escape_room/Assets/third_trophy.png"
        );
      }
    }
  
    startGame();
  });
  