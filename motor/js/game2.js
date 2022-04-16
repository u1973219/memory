function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}


var scoreText;

var girades = [];
let l_partida = null;
if (sessionStorage.idPartida && localStorage.sav2){
    let arrayPartides = JSON.parse(localStorage.sav2);
    if (sessionStorage.idPartida < arrayPartides.length)
        l_partida = arrayPartides[sessionStorage.idPartida];
}

class GameScene extends Phaser.Scene{
    constructor (){
        if (l_partida) {
            super('GameScene');
            this.cards = null;
            this.score = l_partida.score;
            this.correct = l_partida.correct;
            this.firstClick = l_partida.firstClick;
            this.numbercards = l_partida.numbercards;
            this.level = l_partida.level;
            this.points = l_partida.points;
            this.cardsPlaying = l_partida.cardsPlaying;
            this.girades = l_partida.girada;

        }
        else
        {
            super('GameScene');
            this.cards = null;
            this.firstClick = null;
            this.score = 100;
            this.level = 1;
            this.points = 0;
            this.correct = 0;
            this.numbercards = 2;
            this.cardsPlaying = [];
            this.girades = [];
        }
    }

    preload (){
        this.load.image('back', '../resources/back.png');
        this.load.image('cb', '../resources/cb.png');
        this.load.image('co', '../resources/co.png');
        this.load.image('sb', '../resources/sb.png');
        this.load.image('so', '../resources/so.png');
        this.load.image('tb', '../resources/tb.png');
        this.load.image('to', '../resources/to.png');
    }
    create () {
            let arraycards = ['co', 'cb', 'sb', 'so', 'tb', 'to'];
            if(!sessionStorage.idPartida) {
                shuffle(arraycards);
                for (var j = 0; j < this.numbercards; j++) {
                    this.cardsPlaying.push(arraycards[j]);
                    this.cardsPlaying.push(arraycards[j]);
                }
                shuffle(this.cardsPlaying);
            }

            this.cameras.main.setBackgroundColor(0x942275);
            var button = this.add.text(400, 550, 'Save Game')
                .setOrigin(0.5)
                .setPadding(10)
                .setStyle({ backgroundColor: '#111' })
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', ()=>{
                   this.save_game2();
            });

            let pos = 250;
            this.cards = this.physics.add.staticGroup();

        if(sessionStorage.idPartida) {

            let totalcartes = l_partida.girada.length;
            let eliminat = false;
            let j = 0;
            let k = 0;
            for (var n = 0; n < this.numbercards * 2; n++) {
                this.add.image(pos, 300, this.cardsPlaying[n]);
                pos += 100;
            }
            pos = 250;
            while(j < totalcartes) {
                while(eliminat !== true && k<this.cardsPlaying.length) {

                    if (this.cardsPlaying[k] === this.girades[j]) {
                        eliminat = true;
                        this.cardsPlaying.splice(k,1);
                    }
                    else {
                        this.cards.create(pos, 300, 'back');
                        k += 1;
                    }
                    pos += 100;


                }
                j+=1;
                eliminat = false;
            }
            pos = 250;
            while(k<this.cardsPlaying.length){
                this.cards.create(pos, 300, 'back');
                pos += 100;
                k += 1;
            }
        }

        else{
            for (var k = 0; k < this.numbercards * 2; k++) {
                this.add.image(pos, 300, this.cardsPlaying[k]);
                this.cards.create(pos, 300, 'back');
                pos += 100;
            }
        }
        console.log(this.cardsPlaying);
        console.log(this.girades);
        sessionStorage.clear();

            scoreText = this.add.text(16,16, 'Score: ' + this.points, { fontsize: '56 px',fill: '#000',fontStyle: 'bold'});
            let i = 0;
        this.cards.children.iterate((card)=>{
            card.card_id = this.cardsPlaying[i];
            i++;
            card.setInteractive();
            card.on('pointerup', () => {
                card.disableBody(true,true);
                this.girades.push(card.card_id);
                if (this.firstClick){
                    if (this.firstClick.card_id !== card.card_id){
                        this.score -= this.level*5;
                        this.time.delayedCall(1000, () =>
                            {
                                card.enableBody(false, 0, 0, true, true);
                                this.firstClick.enableBody(false, 0, 0, true, true);
                                this.girades.pop();
                                this.girades.pop();
                                this.firstClick = null;
                            },
                            [],this);
                        if (this.score <= 0){
                            alert("Game Over");
                            this.local_save();
                        }
                    }
                    else{
                        this.correct++;
                        if (this.correct >= this.numbercards){
                            var numOfPoints = this.score;
                            if(this.level >= 4) var a = 3;
                            else if(this.level > 8) var a = 4;
                            else var a = 2;
                            alert("You Win with " + this.score + " points.");
                            this.scene.restart(this.cards = null,
                            this.firstClick = null,
                            this.score = 100,
                            this.level += 1,
                            this.points += numOfPoints,
                            this.correct = 0,
                            this.numbercards = a,
                                this.cardsPlaying = [],
                                this.girades = []);
                        }
                        this.firstClick = null;
                    }
                }
                else{
                    this.firstClick = card;
                }
            }, card);
        });
    }
    update () {


    }

    local_save(){
        let puntuacio = this.points;
        let arrayp = [];
        if(localStorage.partides){
            arrayp = JSON.parse(localStorage.partides);
            if(!Array.isArray(arrayp)) arrayp = [];
        }
        arrayp.push(puntuacio);
        localStorage.partides = JSON.stringify(arrayp);
        loadpage("../");
    }
    save_game2(){
        let joc = {
            score: this.score,
            correct: this.correct,
            firstClick: this.firstClick,
            cardsPlaying: this.cardsPlaying,
            cards: null,
            numbercards: this.numbercards,
            difficulty: this.difficulty,
            girada: this.girades,
            level: this.level,
            points: this.points
        };
        let arrayp = [];
        if(localStorage.sav2){
            arrayp = JSON.parse(localStorage.sav2);
            if(!Array.isArray(arrayp)) arrayp = [];
        }
        arrayp.push(joc);
        localStorage.sav2 = JSON.stringify(arrayp);
        loadpage("../");
    }



}