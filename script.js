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
        this.busy = true;
        setTimeout(() => {
            //this.shuffleCards();
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
         }
         /*else if(color1 !== color2 && color1 !== color3 && color2 !== color3){
             matchedc = true;
         }*/

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

        //if(matchedc && matchedf && matchedn && matcheds) {
        if(matchedn){
            this.cardMatch(card, this.cardToCheck, this.cardToCheck2);
        }else{
            this.cardMisMatch(card, this.cardToCheck, this.cardToCheck2);
        }
        this.cardToCheck = null;
        this.cardToCheck2 = null;
    }

    cardMatch(card1, card2, card3) {
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
        if(r[0] !== null)
            return r[0];
        if(g[0] !== null)
            return g[0];
        if(b[0] !== null)
            return b[0];
    }

    getCardFill(card) {
        let e = card.getElementsByClassName('empty');
        let p = card.getElementsByClassName('partial');
        let s = card.getElementsByClassName('solid');
        if(e[0] !== null)
            return e[0];
        if(p[0] !== null)
            return p[0];
        if(s[0] !== null)
            return s[0];
    }

    getCardNum(card) {
        let o = card.getElementsByClassName('one');
        let t = card.getElementsByClassName('two');
        let e = card.getElementsByClassName('three');
        if(o[0] !== null)
            return o[0];
        if(t[0] !== null)
            return t[0];
        if(e[0] !== null)
            return e[0];
    }

    getCardShape(card) {
        let d = card.getElementsByClassName('diamond');
        let e = card.getElementsByClassName('ellipse');
        let s = card.getElementsByClassName('squiggle');
        if(d[0] !== null)
            return d[0];
        if(e[0] !== null)
            return e[0];
        if(s[0] !== null)
            return s[0];
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
