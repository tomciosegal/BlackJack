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
        this.shuffleDeck();
        this.getCardBtn = document.querySelector('#hit')
        this.getCards();
        this.playersPoints = 0;
        this.dealersPoints = 0;
        
    }

    shuffleDeck(){
        return this.deck.sort(() => Math.random() - 0.5)
    }

    countPoints(card, parentId){
        // const property = parentId.replace('Cards', 'Points');
        // this[property] += card.value;
        // document.querySelector(`#${property}`).innerHTML = this[property];

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

    getCards(){
        this.getCardBtn.addEventListener('click', () => {
            const limit = this.playersPoints == 0 && this.dealersPoints == 0 ? 2 : 1;
            ['playersCards', 'dealersCards'].forEach(el => {
                for(let i = 0; i < limit; i++){
                    this.displayDeck(el);
                }
            })
        })
    }

    checkCards(){
        const message = document.querySelector('#message');
        if(this.dealersPoints == 21 || this.dealersPoints == 22 && document.querySelector('#dealersCards').children.length == 2){
             message.textContent = 'Dealer Wins !!!'
             message.style.color = 'red'
             message.style.display = 'block'
            
        }     
    }
}

const blackJack = new Game();




