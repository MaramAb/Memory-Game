 /*
 * Variables declaration
 */
 let cards = document.querySelectorAll(".card");
 let icons = [];
 let openCards = [];
 let matcehdCards = 0;
 let moves = document.querySelector(".moves");
 let stars = document.querySelectorAll(".fa-star");
 let dialog = document.querySelector(".dialog-box");

 let minutesLabel = document.querySelector(".minutes");
 let secondsLabel = document.querySelector(".seconds");
 let totalSeconds = 0;
 let timer;
 let timerIsRunning;


 // add event listener to buttons
 document.querySelector(".restart").addEventListener("click", startGame);
 document.querySelector("#play-again").addEventListener("click", startGame);
 document.querySelector("#cancel").addEventListener("click", function() {
	dialog.close();
 });


function startGame() {
 	
 	// close dialog box
 	dialog.children[1].innerHTML = "";
 	dialog.close();
 	// clear dialog box

 	// empty icons and open cards list
 	icons = [];
 	openCards = [];

 	// initialize moves with 0
	 moves.innerHTML = 0;

	 matchedCards = 0;

 	// make all stars solid
 	for (star of stars){
 		star.classList = "fa fa-star";
 	}

 	for (card of cards) {
	 	// make all cards face down
	 	card.className = "card";
	 	// save icon names to 'icons' list
	 	icons.push(card.children[0].className);
	 	// add event listener to each card
	 	card.addEventListener("click", cardClicked);
	}

	 // shuffle icons list
	 icons = shuffle(icons);

	 // add each icon in the list to each card
	 let i = 0; 
	 for (card of cards) {
	 	card.children[0].className = icons[i];
	 	i++;
	 }
	 
	 // restart timer
	 timer = "";
	 totalSeconds = 0;
	 startTimer();
}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function cardClicked() {
	// resume timer
	startTimer();
	// if less than two cards are open
	if (openCards.length < 2) {
		// if the open card is clicked
		if(this === openCards[0]) {
			// if timer is workin, pause timer
			if(timerIsRunning) {
				stopTimer();
			}
			return;
		}

		// flip card and add it to open cards list
		flip(this);
		openCards.push(this);

		// if tow cards are open
		if (openCards.length == 2) {
			// update the score
			updateScore()
			// check if the two cards match
			setTimeout(match, 1000);
		}
		
	}
	

}

// function to flip card
function flip(card) {
	card.classList.toggle("open");
	card.classList.toggle("show");
}

// this function changes the solid star to a regular star
function starOff(star) {
	star.classList.remove("fa");
	star.classList.add("far");
}

// check if two cards match
function match() {
	let c1 = openCards[0];
	let c2 = openCards[1];
	// check the children class names if they match
	if (c1.children[0].className == c2.children[0].className) {
		// if the two open cards are matching add match class to there classes
		c1.classList.add("match");
		c2.classList.add("match");
		//increament matchedCards
		matchedCards++;
		// if all cards are matched, WINNER!
		if (matchedCards > 7) {
			win();
		}
	} else {
		// if they don't match flip them 
		flip(c1);
		flip(c2);
	}

	// empty open cards list
	openCards = [];
}

// update the score panel (moves and stars)
function updateScore() {
	// moves increment
	let i = moves.innerHTML;
	i++;
	moves.innerHTML = i;

	// update stars status according to the number of moves
	if (i > 20) {
		starOff(stars[1]);
	} else if (i > 15) {
		starOff(stars[2]);
	}
	
}


function startTimer() {
	
	if(!timerIsRunning) {
		timer = setInterval(function() {
			++totalSeconds;
			secondsLabel.innerHTML = pad(totalSeconds % 60);
	  		minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
		}, 1000);
	}
	timerIsRunning = true;
}

function stopTimer() {
	timerIsRunning = false;
	clearInterval(timer);
}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

function win() {
	stopTimer();
	// select the score panel
	let score = document.querySelector(".score-panel");
	// make a copy of score element
	let finalScore = score.cloneNode(true);
	// change class name 
	finalScore.classList.add("final-score");
	// remove the restart button
	finalScore.removeChild(finalScore.children[2]);
	// display the time the user took to complete the game
	var t = document.createElement("p");
	t.innerText = pad(parseInt(totalSeconds / 60)) + ":" + pad(totalSeconds % 60);
	
	// append time and final score to the dialog box
	dialog.children[1].appendChild(t);
	dialog.children[1].appendChild(finalScore);
	
	// show dialog box
	dialog.showModal();
}


startGame();
