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

class GameScene extends Phaser.Scene{
    constructor (){
        super('GameScene');
        this.cards = null;
        this.firstClick = null;
        this.score = 100;
        this.level = 1;
        this.points = 0;
        this.correct = 0;
        this.numbercards = 2;
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
            let cardsPlaying = [];


            shuffle(arraycards);
            for (var j = 0; j < this.numbercards; j++) {
                cardsPlaying.push(arraycards[j]);
                cardsPlaying.push(arraycards[j]);
            }
            shuffle(cardsPlaying);

            this.cameras.main.setBackgroundColor(0x942275);

            let pos = 250;
            this.cards = this.physics.add.staticGroup();

            for (var k = 0; k < this.numbercards * 2; k++) {
                this.add.image(pos, 300, cardsPlaying[k]);
                this.cards.create(pos, 300, 'back');
                pos += 100;
            }

            scoreText = this.add.text(16,16, 'Score: ' + this.points, { fontsize: '56 px',fill: '#000',fontStyle: 'bold'});
            let i = 0;
        this.cards.children.iterate((card)=>{
            card.card_id = cardsPlaying[i];
            i++;
            card.setInteractive();
            card.on('pointerup', () => {
                card.disableBody(true,true);
                if (this.firstClick){
                    if (this.firstClick.card_id !== card.card_id){
                        this.score -= this.level*5;
                        this.time.delayedCall(1000, () =>
                            {
                                card.enableBody(false, 0, 0, true, true);
                                this.firstClick.enableBody(false, 0, 0, true, true);
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
                            this.numbercards = a);
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
        //localStorage.setItem("punts", puntuacio);
        loadpage("../");
    }



}