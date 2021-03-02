const figures = ['two', 'three','four','five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king', 'ace'];
const colors = ["clubs", "diamonds", "spades", "hearts"]
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 11, 11, 11];

class Card {
    constructor(value, figure, color){
        this.value = value;
        this.figure = figure;
        this.color = color;
        this.image = `assets/images/${this.figure}_${this.color}.png`
    }

    render(parentId){
        const parent = document.getElementById(parentId);
        const renderedCard = document.createElement('img')
        renderedCard.src = this.image;
        parent.appendChild(renderedCard)
    }
}

class Game {
    constructor(){
        this.deck = this.generateDeck();
        this.getCardBtn = document.querySelector('#hit');
        this.gameButtons = document.querySelector('#buttons')
        this.playersPoints = 0;
        this.dealersPoints = 0;
        this.dealerMove = false;
        this.standBtn = document.querySelector('#stand');
        this.playAgainBtn = document.querySelector('#playAgain');
        this.bet = document.querySelector('#bet')
        this.playersMoney = document.querySelector('#playersMoney')
        this.tableWallet = document.querySelector('#currentBet')
        this.playersWallet = 100;
        this.currentBet = 0;
        this.betButtons = document.querySelector('#bet_buttons')
        this.initFunctions();
    }

    initFunctions(){
        this.shuffleDeck();
        this.getPlayerCards();
        this.standBtn.addEventListener('click', this.getDealersCards);
        this.playAgainBtn.addEventListener('click', this.playAgain);
        this.displayMoney()
        this.betMoney()
    }

    playAgain = () =>{

        if(this.playersWallet == 0){
            this.playersWallet = 100;
            this.displayMoney();
        }

        for(let button of this.betButtons.querySelectorAll('button[data-bet]')){
            if(button.dataset.bet > this.playersWallet){
                button.style.display = 'none';
            }
        }

        this.deck = this.generateDeck();
        this.shuffleDeck();
        this.playersPoints = 0;
        this.dealersPoints = 0;
        this.dealerMove = false;
        this.betButtons.style.display = 'block';
        this.playAgainBtn.style.display = 'none';
        document.querySelector('#playersCards').innerHTML = '';
        document.querySelector('#dealersCards').innerHTML = '';
        document.querySelector('#message').style.display = 'none'
        document.querySelector('#playersPoints').innerHTML = '';
        document.querySelector('#dealersPoints').innerHTML = '';
    }

    displayMoney(){
        this.playersMoney.textContent = this.playersWallet;
        this.tableWallet.textContent = this.currentBet;
    }

    shuffleDeck(){
        return this.deck.sort(() => Math.random() - 0.5)
    }

    betMoney(){
        const betButtons = document.querySelectorAll('button[data-bet]')
        for (let button of betButtons){
            button.addEventListener('click', e => {
                this.gameButtons.style.display = 'block';
                this.getCardBtn.style.display = 'inline-block';
                //this.standBtn.style.display = 'inline-block';
                this.betButtons.style.display = 'none';
                this.playersWallet = this.playersWallet - e.target.dataset.bet;
                this.currentBet = e.target.dataset.bet *  2;
                this.displayMoney();
            }) 
        } 
    }

    countPoints(card, parentId){
        //here is more cleaver way to implement below method, at this stage developer was 
        //given that option of solution,but prefers to use one below with if & else
        // const property = parentId.replace('Cards', 'Points');
        // this[property] += card.value;
        // document.querySelector(`#${property}`).innerHTML = this[property];
        
        if(card.figure == 'ace' && document.querySelector(`#${parentId}`).children.length > 2){
            card.value = 1;
        }

        if(parentId == 'playersCards'){
            this.playersPoints += card.value
            const playerPoints = document.querySelector('#playersPoints')
            playerPoints.textContent = this.playersPoints
        }
        else {
            this.dealersPoints += card.value
            const dealerPoints = document.querySelector('#dealersPoints')
            dealerPoints.textContent = this.dealersPoints
        }
        this.checkCards()
    }

    displayDeck(parentId){
        const card = this.deck[0];
        card.render(parentId);
        this.deck.shift();
        this.countPoints(card, parentId)
        new Audio('assets/sounds/dealing_card.wav').play();
    }

    generateDeck(){
        const deck = [];
        figures.forEach((figure, idx) => {
            colors.forEach(color => {
                deck.push(new Card(values[idx], figure, color))
            })
        });
        return deck;
    }

    getPlayerCards(){
        this.getCardBtn.addEventListener('click', () => {
            this.standBtn.style.display = 'inline-block';
            const limit = this.playersPoints == 0 && this.dealersPoints == 0 ? 2 : 1;
            for(let i = 0; i < limit; i++){
                setTimeout(() => {
                    this.displayDeck('playersCards');
                }, i * 1000);
            }
        })
    }

    getDealersCards = () => {
        this.getCardBtn.style.display = 'none';
        this.standBtn.style.display = 'none'

        const displayDealerCards = setInterval( () => {
            this.displayDeck('dealersCards');
            if(this.dealersPoints >= this.playersPoints){
                this.dealerMove = true;
                this.checkCards()
                clearInterval(displayDealerCards)
            }
        },1000 )
    }

    checkCards(){
        const message = document.querySelector('#message');
        const playerCardsLength = document.querySelector('#playersCards').children.length;
        const dealerCardsLength = document.querySelector('#dealersCards').children.length;

        //player win or loose conditions

        if((this.playersPoints > 21 && playerCardsLength  > 2) || (this.dealersPoints >= this.playersPoints && (this.dealersPoints <= 21 || this.dealersPoints == 22 && dealerCardsLength == 2))){
            new Audio('assets/sounds/lose_beep.wav').play();
            message.textContent = 'Dealer Wins !!!'
            message.style.color = 'red'
            message.style.display = 'block'
            this.playAgainBtn.style.display = 'block'
            this.getCardBtn.style.display = 'none';
            this.standBtn.style.display = 'none'
            this.currentBet = 0;
            this.displayMoney();
            if(this.playersWallet == 0){
                message.textContent = 'You Lost All Money :)'
                this.playAgainBtn.style.display = 'inline-block'
            }
        }

        else if((this.dealersPoints > 21 && dealerCardsLength > 2) || (this.playersPoints >= this.dealersPoints && (this.playersPoints <= 21 || this.playersPoints == 22 && playerCardsLength == 2)) && this.dealersMove){
            message.textContent = 'You Win !!!'
            message.style.color = 'gold'
            message.style.display = 'block'
            new Audio('assets/sounds/win_beep.mp3').play();
            this.playAgainBtn.style.display = 'block';
            this.playersWallet += this.currentBet;  
            this.currentBet = 0;
            this.displayMoney();
        }

        
        
    }
}

const blackJack = new Game();






