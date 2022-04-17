
//funció que ens barreja les cartes de la array passada
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;


    while (currentIndex != 0) {


        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}


var scoreText; //var que ens servirà per escriure el socre a la pantalla.

var girades = [] //array que guarda les cartes girades

//carreguem una partida si es que venim del menú de load.
let l_partida = null;
if (sessionStorage.idPartida && localStorage.sav2){
    let arrayPartides = JSON.parse(localStorage.sav2);
    if (sessionStorage.idPartida < arrayPartides.length)
        l_partida = arrayPartides[sessionStorage.idPartida];
}

class GameScene extends Phaser.Scene{
    constructor (){
        if (l_partida) { // si venim d'una partida carregada posem els valors que haviem guardat
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
        else //sino els valors estàndards
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
            let arraycards = ['co', 'cb', 'sb', 'so', 'tb', 'to']; //array amb totes les cartes

            if(!sessionStorage.idPartida) { // si creem una nova partida entrem aquí si és d'una carregada no ja que això és per a crear cardsPlaying que creea les cartes del tauler.
                shuffle(arraycards);
                for (var j = 0; j < this.numbercards; j++) {
                    this.cardsPlaying.push(arraycards[j]); //fem un push dues vegades ja que necesitem cada carta dos cops.
                    this.cardsPlaying.push(arraycards[j]);
                }
                shuffle(this.cardsPlaying);
            }

            this.cameras.main.setBackgroundColor(0x942275); //color de fons.

            var button = this.add.text(400, 550, 'Save Game') //el botó de save game, que és un text que sàctiva al clickar a sobre.
                .setOrigin(0.5)
                .setPadding(10)
                .setStyle({ backgroundColor: '#111' })
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', ()=>{
                   this.save_game2();
            });

            let pos = 250;
            this.cards = this.physics.add.staticGroup();

        if(sessionStorage.idPartida) { //si venim d'un load

            //variables que utilitzo per a fer bucles més endevant.
            let cartesTauler = this.cardsPlaying.length;
            let eliminat = false;
            let j = 0;
            let k = 0;

            for (var n = 0; n < this.numbercards * 2; n++) { // s'afageixen les imatges de les cartes
                this.add.image(pos, 300, this.cardsPlaying[n]);
                pos += 100;
            }
            pos = 250;
            var arrayP = [];
            while(k<cartesTauler) {//per a posar a sobre de les imatges corresponents una carta per radere. osigui per deixar les cartes tal qual girades o no del que estaven al fer el save.
                j = 0;
                while(!eliminat && j<this.girades.length){
                    if(this.girades[j] === this.cardsPlaying[k]) {//si les cartes coincideixen
                        eliminat = true;
                        arrayP.push(k);//fem push per guardar que la carta s'ha girat per ajudar-nos més avall
                    }
                    else j += 1;
                }
                if(!eliminat || this.girades.length===0) this.cards.create(pos, 300, 'back');
                else this.girades.splice(j,1);
                eliminat = false;
                pos+=100;
                k+=1;
            }
            var nova_a = [];//creearem nova array de suport
            for (var l = 0;l < this.numbercards*2;l++){


                if(!arrayP.includes(l)) { nova_a.push(this.cardsPlaying[l]); } // si l'index l actual no està a l'arrayP vol dir que la carta no s'esta mostrant per tant afegim

            }
            this.cardsPlaying = nova_a.slice(); //donem doncs el nou valor, on només tindrà ara les cartes que no es veuen
        }

        else{
            for (var k = 0; k < this.numbercards * 2; k++) {// fem un bucle per a posar totes les cartes girades ila seva imatge corresponent a sota.
                this.add.image(pos, 300, this.cardsPlaying[k]);
                this.cards.create(pos, 300, 'back');
                pos += 100;
            }
        }

        sessionStorage.clear();

            scoreText = this.add.text(16,16, 'Score: ' + this.points, { fontsize: '56 px',fill: '#000',fontStyle: 'bold'}); //es el marcador de score. S'axtualitza cada nivell
            let i = 0;
        this.cards.children.iterate((card)=>{
            card.card_id = this.cardsPlaying[i];
            i++;
            card.setInteractive();
            card.on('pointerup', () => {
                card.disableBody(true,true);
                this.girades.push(card.card_id); //afegeim la carta actual a girades perque la estem veient i està girada.
                if (this.firstClick){
                    if (this.firstClick.card_id !== card.card_id){
                        this.score -= this.level*3; //per a la puntuació fem nivell * 3
                        this.time.delayedCall(1000, () => //funció que tarda un segon en girar les cartes
                            {
                                card.enableBody(false, 0, 0, true, true);
                                this.firstClick.enableBody(false, 0, 0, true, true);
                                this.girades.pop();
                                this.girades.pop(); //fem un .pop de girades perque vol dir que no estan girades les cartes afegides ja
                                this.firstClick = null;
                            },
                            [],this);
                        if (this.score <= 0){
                            alert("Game Over");
                            this.local_save();//quan perdem crideem local_save per a guardar score
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
                            //fem un scene.restart, així reiniciem la escena actual de phaser. Passant els valors que volem que tinguin les variables que s'utilitzen i es creen al constructor.
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

    local_save(){ //per guardar score
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
    save_game2(){ //per guardar una partida
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