
//funció que ens barreja les cartes de la array passada
function shuffle(array) {
	let currentIndex = array.length,  randomIndex;

	while (currentIndex != 0) {

		randomIndex = Math.floor(Math.random() * currentIndex); //agafa num aleatori
		currentIndex--;

		// intercanvia amb un altre
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
}

//carrega les opcions de la partida
var load_param = function (){

	var json = localStorage.getItem("config");
	if(json)
		options_game = JSON.parse(json);
	else{
		options_game.cards = 2;
		options_game.dificulty = "hard";
	}

}
load_param(); //per executar la funció anterior

//arrays de cartes girades i de les cartes del tauler
var girades = [];
var cardsPlaying = [];
//carreguem una partida si es que venim del menú de load.
let l_partida = null;
if (sessionStorage.idPartida && localStorage.sav){
	let arrayPartides = JSON.parse(localStorage.sav);
	if (sessionStorage.idPartida < arrayPartides.length)
		l_partida = arrayPartides[sessionStorage.idPartida];

}


class GameScene extends Phaser.Scene {
    constructor (){
		if (l_partida){// si venim d'una partida carregada posem els valors que haviem guardat
			super('GameScene');
			this.cards = null;
			this.score = l_partida.score;
			this.correct = l_partida.correct;
			this.firstClick = l_partida.firstClick;
			this.numbercards = l_partida.numbercards;
			this.difficulty = l_partida.difficulty;

		}
		else {//sino els valors estàndards
			super('GameScene');
			this.cards = null;
			this.score = 100;
			this.correct = 0;
			this.firstClick = null;
			this.numbercards = options_game.cards;
			this.difficulty = options_game.dificulty;
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
		this.load.image('button','../resources/button.png');
	}
	
    create (){
		let arraycards = ['co', 'cb','sb','so','tb','to'];//array amb totes les cartes

		sessionStorage.clear(); //borrem si veniem de un load la sessió que haviem carregat
		cardsPlaying = [];

		if(!l_partida) {// si creem una nova partida entrem aquí si és d'una carregada no ja que això és per a crear cardsPlaying que creea les cartes del tauler.
			shuffle(arraycards);//barrejem array de cartes
			for (var j = 0; j < this.numbercards; j++) {
				cardsPlaying.push(arraycards[j]);
				cardsPlaying.push(arraycards[j]);//fem un push dues vegades ja que necesitem cada carta dos cops.
			}
			shuffle(cardsPlaying);//barrejem array de cartes del tauler
		}
		else
			cardsPlaying = l_partida.cardsPl;


		var button = this.add.text(400, 550, 'Save Game') //botó de guardar partida
			.setOrigin(0.5)
			.setPadding(10)
			.setStyle({ backgroundColor: '#111' })
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', ()=>{
			     this.save_game();
			});


		this.cameras.main.setBackgroundColor(0x942275);

		let pos = 250;
		this.cards = this.physics.add.staticGroup();

         if(l_partida) {//si venim d'un load
			 girades = l_partida.girada;
			 //variables que utilitzo per a fer bucles més endevant.
				 let cartesTauler = cardsPlaying.length;
				 let eliminat = false;
				 let j = 0;
			     let k = 0;
			 for (var n = 0; n < this.numbercards * 2; n++) { // s'afageixen les imatges de les cartes
				 this.add.image(pos, 300, cardsPlaying[n]);
				 pos += 100;
			 }
				 pos = 250;

             var arrayP = [];
			 while(k<cartesTauler) {//per a posar a sobre de les imatges corresponents una carta per radere. osigui per deixar les cartes tal qual girades o no del que estaven al fer el save.
				 j = 0;
				 while(!eliminat && j<girades.length){
					 if(girades[j] === cardsPlaying[k]) {//si les cartes coincideixen
						 eliminat = true;
						 arrayP.push(k);//fem push per guardar que la carta s'ha girat per ajudar-nos més avall
					 }
					 else j += 1;
				 }
				 if(!eliminat || girades.length===0) this.cards.create(pos, 300, 'back');
				 else girades.splice(j,1);
				 eliminat = false;
				 pos+=100;
				 k+=1;
			 }
			 var nova_a = [];//creearem nova array de suport
			 for (var l = 0;l < this.numbercards*2;l++){


				 if(!arrayP.includes(l)) { nova_a.push(cardsPlaying[l]); } // si l'index l actual no està a l'arrayP vol dir que la carta no s'esta mostrant per tant afegim

			 }
             cardsPlaying = nova_a.slice(); //donem doncs el nou valor, on només tindrà ara les cartes que no es veuen


		 }
		 else{ //si creem nova partida
			 for (var k = 0; k < this.numbercards * 2; k++) {// fem un bucle per a posar totes les cartes girades ila seva imatge corresponent a sota.
				 this.add.image(pos, 300, cardsPlaying[k]);
				 this.cards.create(pos, 300, 'back');
				 pos += 100;
			 }
		 }


		let i = 0;

		this.cards.children.iterate((card)=>{
			card.card_id = cardsPlaying[i];
			i++;
			card.setInteractive();
			card.on('pointerup', () => {
				card.disableBody(true,true);
				girades.push(card.card_id);//afegeim la carta actual a girades perque la estem veient i està girada.
				if (this.firstClick){
					if (this.firstClick.card_id !== card.card_id){
						//per a calcular el score depenen de si tenim diciultat easy normal o hard
						if(this.difficulty === "easy") this.score -= 20;
						else if (this.difficulty === "normal") this.score -= 30;
						else this.score -= 40;
						this.time.delayedCall(1000, () =>//funció que tarda un segon en girar les cartes
						{
							card.enableBody(false, 0, 0, true, true);
							this.firstClick.enableBody(false, 0, 0, true, true);
							girades.pop();
							girades.pop();//fem un .pop de girades perque vol dir que no estan girades les cartes afegides ja
							this.firstClick = null;
						},
							[],this);
						if (this.score <= 0){
							alert("Game Over");
							loadpage("../");
						}
					}
					else{
						this.correct++;
						if (this.correct >= this.numbercards){
							alert("You Win with " + this.score + " points.");
							loadpage("../");
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
	
	update (){	}

	    save_game() {//funció de guardar dades de partida
		let joc = {
			score: this.score,
			correct: this.correct,
			firstClick: this.firstClick,
			cardsPl: cardsPlaying,
			cards: null,
			numbercards: this.numbercards,
			difficulty: this.difficulty,
			girada: girades
		};
		let arrayp = [];
		if(localStorage.sav){
			arrayp = JSON.parse(localStorage.sav);
			if(!Array.isArray(arrayp)) arrayp = [];
		}
		arrayp.push(joc);
		localStorage.sav = JSON.stringify(arrayp);
		loadpage("../");

	}


}



