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
    }

    shuffleDeck(){
        return this.deck.sort(() => Math.random() - 0.5)
    }

    displayDeck(parentId){
        console.log(parentId);
        this.deck[0].render(parentId);
        this.deck.shift()
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
}

const blackJack = new Game();

['playersCards', 'dealersCards'].forEach(el => {
    for(let i = 0; i < 2; i++){
        console.log(el);
        blackJack.displayDeck(el);
    }
})


