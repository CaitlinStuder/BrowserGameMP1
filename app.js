document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector(".grid");
  const width = 8;
  const natureCrushBoard = [];
  let score = 0;

  const animalEmojis = [
    "url(images/butterfly.png)",
    "url(images/dino.png)",
    "url(images/elephant.png)",
    "url(images/sloth.png)",
    "url(images/tiger.png)",
    "url(images/whale.png)",
  ];

  const randomAnimalEmoji = () =>
    animalEmojis[Math.floor(Math.random() * animalEmojis.length)];



  let animalDragged,
    animalIdDragged,
    animalReplaced,
    animalIdReplaced;



  const newScore = (amount, increment = true) => {
    score = increment ? score + amount : amount;
    document.getElementById("score").innerHTML = score;
  };

  const checkAnimalsInFirstColumn = () => 
    animalIdDragged % width === 0;
    

  const checkAnimalsInLastColumn = () =>
    animalIdDragged % width === width - 1;


  const createGrid = () => {
    newScore(0, false);
    for (let i = 0; i < width * width; i++) {
      const animal = document.createElement("div");
      animal.classList.add("animal");
      animal.style.backgroundImage = randomAnimalEmoji();
      animal.setAttribute("draggable", true);
      animal.setAttribute("id", i);

      animal.addEventListener("dragstart", dragStart);
      animal.addEventListener("dragend", dragEnd);
      animal.addEventListener("dragover", dragOver);
      animal.addEventListener("dragenter", dragEnter);
      animal.addEventListener("drageleave", dragLeave);
      animal.addEventListener("drop", dragDrop);

      grid.appendChild(animal);
      natureCrushBoard.push(animal);
    }
  };

  function dragStart() {
    animalDragged = this.style.backgroundImage;
    animalIdDragged = parseInt(this.id);
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
  }

  function dragLeave() {
    this.style.backgroundImage = "";
  }

  function dragDrop() {
    animalReplaced = this.style.backgroundImage;
    animalIdReplaced = parseInt(this.id);
  }

  function dragEnd() {
    //What is a valid move?
    const acceptedSwitches = [
      animalIdDragged - width,
      animalIdDragged + width,
    ];
    if (!checkAnimalsInFirstColumn()) {
      acceptedSwitches.push(animalIdDragged - 1);
    }
    if (!checkAnimalsInLastColumn()) {
      acceptedSwitches.push(animalIdDragged + 1);
    } 

    let acceptedSwitch = acceptedSwitches.includes(animalIdReplaced);

    if (animalIdReplaced && acceptedSwitch) {
      natureCrushBoard[animalIdReplaced].style.backgroundImage = animalDragged;
      natureCrushBoard[animalIdDragged].style.backgroundImage = animalReplaced;
      animalIdReplaced = null;
      confirmMatch();
    } else {
      natureCrushBoard[animalIdDragged].style.backgroundImage = animalDragged;
    }
  }

  //drop candies once some have been cleared
  const refillGrid = () => {
    for (i = natureCrushBoard.length - 1; i >= width; i--) {
      if (natureCrushBoard[i].style.backgroundImage === "") {
        if (natureCrushBoard[i - width].style.backgroundImage !== "") {
          natureCrushBoard[i].style.backgroundImage =
            natureCrushBoard[i - width].style.backgroundImage;
          natureCrushBoard[i - width].style.backgroundImage = "";
        } else {
          natureCrushBoard[i].style.backgroundImage = randomAnimalEmoji();
        }
      }
    }
    //Generate candies in first line
    for (i = 0; i < width; i++) {
      if (natureCrushBoard[i].style.backgroundImage === "") {
        natureCrushBoard[i].style.backgroundImage = randomAnimalEmoji();
      }
    }
    confirmMatch();
  };

  ///Checking for Matches
  const checkForMatch = (limit, createIndexCheck, restrict) => {
    let matchExists = false;
    for (let i = 0; i < limit; i++) {
      if (restrict && restrict(i)) continue;
      if (natureCrushBoard[i].style.backgroundImage === "") continue;
      const indexCheck = createIndexCheck(i);
      const currentAnimalEmoji = natureCrushBoard[i].style.backgroundImage;
      if (indexCheck.every(animalIndex => natureCrushBoard[animalIndex].style.backgroundImage === currentAnimalEmoji)) {
        indexCheck.push(i);
        indexCheck.forEach((index) => {
          natureCrushBoard[index].style.backgroundImage = "";
        });
        newScore(indexCheck.length);
        matchExists = true;
      }
    }
    return matchExists;
  };

  const checkRowsForMatch = (totalMatches) => {
    const limit = natureCrushBoard.length - totalMatches;
    const createIndexCheck = (id) => {
      const indexCheck = [];
      for (let j = 1; j < totalMatches; j++) {
        indexCheck.push(id + j);
      }
      return indexCheck;
    };
    const restrict = (id) =>
      id % width > width - totalMatches;
    return checkForMatch(limit, createIndexCheck, restrict);
  };

  const checkColumnsForMatch = (totalMatches) => {
    const limit = natureCrushBoard.length - (totalMatches - 1) * width;
    const createIndexCheck = (id) => {
      const indexCheck = [];
      for (let j = 1; j < totalMatches; j++) {
        indexCheck.push(id + j * width);
      }
      return indexCheck;
    };
    const restrict = null;
    return checkForMatch(limit, createIndexCheck, restrict);
  };

  const confirmMatch = () => {
    let matchExists = false;
    matchExists = checkRowsForMatch(5) || matchExists;
    matchExists = checkColumnsForMatch(5) || matchExists;
    matchExists = checkRowsForMatch(4) || matchExists;
    matchExists = checkColumnsForMatch(4) || matchExists;
    matchExists = checkRowsForMatch(3) || matchExists;
    matchExists = checkColumnsForMatch(3) || matchExists;

    if (matchExists) {
      setTimeout(() => {
        refillGrid();
      }, 250);
    }
  };

  createGrid();
  confirmMatch();

})