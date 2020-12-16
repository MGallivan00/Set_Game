class Deck {
    constructor() {
        this.deck = [];
        this.decklength = 100;
        this.deckleft = this.decklength;
        this.reset();
        this.shuffle();
    }

    reset() {
        /*const colors = ['red', 'green', 'blue'];
        const fills = ['empty', 'partial', 'solid'];
        const shapes = ['ellipse', 'diamond', 'squiggle'];
        const nums = ['one', 'two', 'three'];*/

        const colors = ['red', 'green', 'blue'];
        const nums = ['one', 'two', 'three'];
        const fills = ['solid'];
        const shapes = ['diamond'];
        this.decklength = colors.length * fills.length * shapes.length * nums.length;
        this.deckleft = this.decklength;

        for (let c = 0; c < colors.length; c++) {
            for (let f = 0; f < fills.length; f++) {
                for (let s = 0; s < shapes.length; s++) {
                    for (let n = 0; n < nums.length; n++) {
                        let d = colors[c] + " " + fills[f] + " " + shapes[s] + " " + nums[n];
                        this.deck.push(d);
                        console.log(d);
                    }
                }
            }
        }
    }

    shuffle() {
        console.log("shuffled");
        const {deck} = this;
        let m = deck.length, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            [deck[m], deck[i]] = [deck[i], deck[m]];
        }
        return this;
    }

    findimage(card){
        let values = card.split(" ");
        let png = "Assets/" + values[0] + "_" + values[1] + "_" + values[2] + "_" + values[3] + ".png";
        console.log(png);
        return png;
    }

    deal() {
        if(this.deckleft > 0) {
            this.deckleft--;
            let card, cardNode, cardfrontNode, imageNode, cardbackNode;
            card = this.deck.pop();
            cardNode = document.createElement("Div");
            cardNode.className = "card";

            cardfrontNode = document.createElement("Div");
            cardfrontNode.className = "card-front card-face";
            imageNode = document.createElement("Img");
            imageNode.className = card;
            imageNode.src = this.findimage(card);
            cardfrontNode.appendChild(imageNode);

            cardbackNode = document.createElement("Div")
            cardbackNode.className = "card-back card-face";
            imageNode = document.createElement("Img");
            imageNode.src = "Assets/logo.png";
            imageNode.alt = "Logo";
            cardbackNode.appendChild(imageNode);

            cardNode.appendChild(cardfrontNode);
            cardNode.appendChild(cardbackNode);

            return cardNode;
        } else{
            return undefined;
        }
    }
}

class Set {
    constructor(totalTime) {
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('sets');
        this.pileleft = document.getElementById('pile-left');
        this.numofselected = 0;
        this.deck = new Deck();
    }
    startGame() {
        this.cardToCheck = null;
        this.cardToCheck2 = null;
        this.totalSets = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.numofselected = 0;
        this.firstEmpty = false;
        let card;
        this.busy = true;
        setTimeout(() => {
            this.deck.shuffle();
            for(let i = 0; i < 3; i++) {
                card = this.deck.deal();
                document.getElementsByClassName('game-container')[0].appendChild(card);
            }
            clickReady(this);
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500);
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalSets;
        this.pileleft.innerText = (this.deck.deckleft - 6);
    }

    hideCards() {
        let cards = Array.from(document.getElementsByClassName('card'));
        cards.forEach(card => {
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

    removeMatched() {
        let rm = document.getElementsByClassName('card matched');
        for(let i = rm.length -1; i >=0; i-- ){
            rm[i].remove();
        }
    }

    /*
    move(card1, card2, card3){
    }
*/
    checkEmpty(){
        if(!this.firstEmpty) {
            if (this.deck.deckleft === 0) {
                let cardNode = document.getElementsByClassName('pile r')[0];
                cardNode.getElementsByTagName('img')[0].remove();
                cardNode.classList.remove('inuse');
                this.firstEmpty = true;
            }
        } else if (this.matchedCards.length === this.deck.decklength) {
            this.victory();
        }
    }

    replenish(){
        for (let i = 0; i < 3; i++) {
            let card = this.deck.deal();
            console.log(card);
            if (card !== undefined) {
                document.getElementsByClassName('game-container')[0].appendChild(card);
            }
            this.checkEmpty();
            this.pileleft.innerText = this.deck.deckleft;
        }
    }

    discardAnimation(){
        if(this.totalSets === 1){
            let imageNode, cardNode;
            imageNode = document.createElement("Img");
            cardNode = document.getElementsByClassName('pile l')[0];
            imageNode.src = "Assets/logo.png";
            imageNode.alt = "Logo";
            cardNode.appendChild(imageNode);
            cardNode.classList.add('inuse');
        }
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
        setTimeout(() => {
            this.removeMatched();
            this.discardAnimation();
            this.replenish();
            clickReady(this);
            this.busy = false;
        }, 500);
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
        console.log("GAME OVER");
        clearInterval(this.countDown);
        document.getElementById('game-over-text').classList.add('visible');
    }

    victory() {
        console.log("VICTORY");
        clearInterval(this.countDown);
        document.getElementById('victory-text').classList.add('visible');
    }

    canSelectCard(card) {
        return this.numofselected < 3 && !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck && card !== this.cardToCheck2;
    }
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let game = new Set(100);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });
}
function clickReady(game) {
    let cards = Array.from(document.getElementsByClassName('card'));
    console.log("CARDS BEFORE: " + cards);

    cards.forEach(card => {
        card.addEventListener('click', () => {
            console.log("Click");
            game.selectCard(card);
        });
    });
}

if(document.readyState === 'loading') {
    console.log("loading...");
    document.addEventListener('waiting', ()=> {ready()});
} else {
    console.log("start");
    ready();
}


