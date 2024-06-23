const cards = [
    '2_of_clubs.png',
    '2_of_clubs.png',
    '3_of_diamonds.png',
    '3_of_diamonds.png',
    '4_of_spades.png',
    '4_of_spades.png',
    'ace_of_hearts.png',
    'ace_of_hearts.png',
    'queen_of_clubs2.png',
    'queen_of_clubs2.png'
];

let flippedCards = [];
let matchedCards = [];
let moves = 0;
let timer = 0;
let timerInterval;
let gameStarted = false; // Flag to track if the game has started
const cardsContainer = document.getElementById('cards-container');
const movesElement = document.getElementById('moves');
const timerElement = document.getElementById('timer');
const titleElement = document.querySelector('.game-title');
const redCrossElement = document.getElementById('red-cross');
const wrongSound = new Audio('wrong.mp3');

function startGame() {
    moves = 0;
    timer = 0;
    matchedCards = [];
    flippedCards = [];
    updateMoves();
    shuffleCards();
    createCards();
    // Timer starts only when the first card is flipped
}

function shuffleCards() {
    cards.sort(() => Math.random() - 0.5);
}

function createCards() {
    cardsContainer.innerHTML = '';
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.style.backgroundImage = `url('back.png')`; // Set initial back image
        cardElement.setAttribute('data-index', index); // Store original index for comparison
        cardElement.addEventListener('click', () => flipCard(cardElement, index));
        cardsContainer.appendChild(cardElement);
    });
}

function flipCard(cardElement, index) {
    if (!gameStarted) {
        gameStarted = true;
        startTimer();
    }

    if (flippedCards.length < 2 && !flippedCards.includes(cardElement) && !cardElement.classList.contains('matched')) {
        flippedCards.push(cardElement);
        cardElement.classList.add('flipped');
        cardElement.style.backgroundImage = `url(${cards[index]})`; // Show card image
        moves++;

        if (flippedCards.length === 2) {
            const card1Index = parseInt(flippedCards[0].getAttribute('data-index'));
            const card2Index = parseInt(flippedCards[1].getAttribute('data-index'));

            if (cards[card1Index] === cards[card2Index]) {
                setTimeout(() => {
                    flippedCards.forEach(card => card.classList.add('matched'));
                    matchedCards.push(card1Index, card2Index);

                    if (matchedCards.length === cards.length) {
                        setTimeout(() => {
                            alert(`Congratulations! You've matched all cards in ${moves} moves. Time taken: ${timer} seconds.`);
                        }, 500);
                        clearInterval(timerInterval);
                    }
                    flippedCards = [];
                }, 500);
            } else {
                wrongSound.currentTime = 0; // Rewind sound to start
                wrongSound.play();
                titleElement.style.color = 'red'; // Change title color to red
                redCrossElement.style.display = 'block'; // Show the red cross
                setTimeout(() => {
                    titleElement.style.color = 'black'; // Revert title color to black
                    redCrossElement.style.display = 'none'; // Hide the red cross
                    flippedCards.forEach(card => {
                        card.classList.remove('flipped');
                        card.style.backgroundImage = `url('back.png')`; // Revert to back image
                    });
                    flippedCards = [];
                }, 1000);
            }
            updateMoves();
        }
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        timerElement.textContent = timer;
    }, 1000);
}

function updateMoves() {
    movesElement.textContent = moves;
}

startGame();
