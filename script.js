class Deck {
    constructor() {
        this.deck = [];
        this.reset();
        this.shuffle();
    }

    reset() {
        this.deck = [];
        const colors = ['red', 'green', 'blue'];
        //const fills = ['empty', 'partial', 'solid'];
        const fills = ['solid'];
        const shapes = ['diamond'];
        //const shapes = ['ellipse', 'diamond', 'squiggle'];
        const nums = ['one', 'two', 'three'];
        for (let color in colors) {
            for (let fill in fills) {
                for (let shape in shapes) {
                    for (let num in nums) {
                        let d = color + ' ' + fill + ' ' + shape + ' ' + num;
                        this.deck.push(d);
                    }
                }
            }
        }
    }

    shuffle() {
        const {deck} = this;
        let m = deck.length, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            [deck[m], deck[i]] = [deck[i], deck[m]];
        }
        return this;
    }

    deal() {
        let card, cardNode, cardfrontNode, imageNode, cardbackNode;
        card = this.deck.pop();
        cardNode = document.createElement("Div");
        cardNode.className = "card";

        cardfrontNode = document.createElement("Div");
        cardfrontNode.className = "card-front card-face";
        imageNode = document.createElement("Img");
        imageNode.className = card;
        imageNode.src = this.findimage(card);

        cardbackNode = document.createElement("Div")
        cardbackNode.className = "card-back card-face";
        imageNode = document.createElement("Img");
        imageNode.src = "Assets/logo.png";
        imageNode.alt = "Logo";
        return card;
    }

    findimage(card){
        let values = card.split(" ");
        let png = values[0] + "_" + values[1] + "_" + values[2] + "_" + values[3] + ".png";
        return png;
    }
}

class Set {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('sets');
        this.numofselected = 0;
    }
    startGame() {
        this.cardToCheck = null;
        this.cardToCheck2 = null;
        this.totalSets = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.numofselected = 0;
        let card;
        this.busy = true;
        setTimeout(() => {
            const deck1 = new Deck();
            for(let i = 0; i < 12; i++) {
                card = deck1.deal();
                document.appendChild(card);
            }
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500);
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalSets;
    }
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('selected');
            card.classList.remove('matched');
        });
    }
    selectCard(card) {
        if(this.canSelectCard(card)) {
            card.classList.add('selected');
            this.numofselected++;
            if(this.numofselected === 3)
                this.checkForCardMatch(card);
            else if(this.cardToCheck === null)
                this.cardToCheck = card;
            else
                this.cardToCheck2 = card;
        }
    }
    checkForCardMatch(card) {
        let matchedc = false;
        let matchedf = false;
        let matchedn = false;
        let matcheds = false;

        //check color
        let color1 = this.getCardColor(card);
        let color2 = this.getCardColor(this.cardToCheck);
        let color3 = this.getCardColor(this.cardToCheck2);

        if(color1 === color2 && color2 === color3) {
            matchedc = true;
        }else if(color1 !== color2 && color1 !== color3 && color2 !== color3){
            matchedc = true;
        }

        //check fill
        let fill1 = this.getCardFill(card);
        let fill2 = this.getCardFill(this.cardToCheck);
        let fill3 = this.getCardFill(this.cardToCheck2);

        if(fill1 === fill2 && fill2 === fill3){
            matchedf = true;
        }else if(fill1 !== fill2 && fill1 !== fill3 && fill2 !== fill3) {
            matchedf = true;
        }

        //check number
        let num1 = this.getCardNum(card);
        let num2 = this.getCardNum(this.cardToCheck);
        let num3 = this.getCardNum(this.cardToCheck2);

        if(num1 === num2 && num2 === num3){
            matchedn = true;
        }
        if(num1 !== num2 && num1 !== num3 && num2 !== num3) {
            matchedn = true;
        }

        //check shape
        let shape1 = this.getCardShape(card);
        let shape2 = this.getCardShape(this.cardToCheck);
        let shape3 = this.getCardShape(this.cardToCheck2);

        if(shape1 === shape2 && shape2 === shape3){
            matcheds = true;
        }else if(shape1 !== shape2 && shape1 !== shape3 && shape2 !==shape3) {
            matcheds = true;
        }

        if(matchedc && matchedf && matchedn && matcheds) {
            this.cardMatch(card, this.cardToCheck, this.cardToCheck2);
        }else{
            this.cardMisMatch(card, this.cardToCheck, this.cardToCheck2);
        }
        this.cardToCheck = null;
        this.cardToCheck2 = null;
    }

    move(card1, card2, card3){

    }

    cardMatch(card1, card2, card3) {
        this.busy = true;
        this.totalSets++;
        this.ticker.innerText = this.totalSets;
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        this.matchedCards.push(card3);
        card1.classList.add('matched');
        card2.classList.add('matched');
        card3.classList.add('matched');
        this.numofselected = 0;
        card1.classList.remove('selected');
        card2.classList.remove('selected');
        card3.classList.remove('selected');
        move(card1, card2, card3);
        if(this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }
    cardMisMatch(card1, card2, card3) {
        this.busy = true;
        setTimeout(() => {
            this.numofselected = 0;
            card1.classList.remove('selected');
            card2.classList.remove('selected');
            card3.classList.remove('selected');
            this.busy = false;
        }, 1000);
    }
    getCardColor(card) {
        let r = card.getElementsByClassName('red');
        let g = card.getElementsByClassName('green');
        let b = card.getElementsByClassName('blue');
        if(r[0] !== undefined)
            return "r";
        if(g[0] !== undefined)
            return "g";
        if(b[0] !== undefined)
            return "b";
    }

    getCardFill(card) {
        let e = card.getElementsByClassName('empty');
        let p = card.getElementsByClassName('partial');
        let s = card.getElementsByClassName('solid');
        if(e[0] !== undefined)
            return "e";
        if(p[0] !== undefined)
            return "p";
        if(s[0] !== undefined)
            return "s";
    }

    getCardNum(card) {
        let o = card.getElementsByClassName('one');
        let t = card.getElementsByClassName('two');
        let e = card.getElementsByClassName('three');
        if(o[0] !== undefined)
            return "o";
        if(t[0] !== undefined)
            return "t";
        if(e[0] !== undefined)
            return "h";
    }

    getCardShape(card) {
        let d = card.getElementsByClassName('diamond');
        let e = card.getElementsByClassName('ellipse');
        let s = card.getElementsByClassName('squiggle');
        if(d[0] !== undefined)
            return "d";
        if(e[0] !== undefined)
            return "l";
        if(s[0] !== undefined)
            return "q";
    }

    startCountDown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0)
                this.gameOver();
        }, 1000);
    }

    gameOver() {
        clearInterval(this.countDown);
        document.getElementById('game-over-text').classList.add('visible');
    }

    victory() {
        clearInterval(this.countDown);
        document.getElementById('victory-text').classList.add('visible');
    }

    shuffleCards() {
        for(let i = this.cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i+1));
            this.cardsArray[randIndex].style.order = i.toString();
            this.cardsArray[i].style.order = randIndex.toString();
        }
    }

    canSelectCard(card) {
        return this.numofselected < 3 && !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck && card !== this.cardToCheck2;
    }
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new Set(100, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.selectCard(card);
        });
    });
}

if(document.readyState === 'loading') {
    document.addEventListener('waiting', ()=> {ready()});
} else {
    ready();
}
