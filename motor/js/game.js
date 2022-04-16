function shuffle(array) {
	let currentIndex = array.length,  randomIndex;

	while (currentIndex != 0) {

		randomIndex = Math.floor(Math.random() * currentIndex); //agafa num aleatori
		currentIndex--;

		// intercanvia amb un altre
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}

	return array;
}

var load_param = function (){

	var json = localStorage.getItem("config");
	if(json)
		options_game = JSON.parse(json);
	else{
		options_game.cards = 2;
		options_game.dificulty = "hard";
	}

}
load_param();

var girades = [];
var cardsPlaying = [];

let l_partida = null;
if (sessionStorage.idPartida && localStorage.sav){
	let arrayPartides = JSON.parse(localStorage.sav);
	if (sessionStorage.idPartida < arrayPartides.length)
		l_partida = arrayPartides[sessionStorage.idPartida];
}


class GameScene extends Phaser.Scene {
    constructor (){
		if (l_partida){
			super('GameScene');
			this.cards = null;
			this.score = l_partida.score;
			this.correct = l_partida.correct;
			this.firstClick = l_partida.firstClick;
			this.numbercards = l_partida.numbercards;
			this.difficulty = l_partida.difficulty;

		}
		else {
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
		let arraycards = ['co', 'cb','sb','so','tb','to'];

		sessionStorage.clear();
		cardsPlaying = [];

		shuffle(arraycards);
		for (var j = 0;j < this.numbercards; j++){
			cardsPlaying.push(arraycards[j]);
			cardsPlaying.push(arraycards[j]);
		}
		shuffle(cardsPlaying);
		if(l_partida) cardsPlaying = l_partida.cardsPlaying;


		var button = this.add.text(400, 550, 'Save Game')
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

         if(l_partida) {

			     girades = l_partida.girada;
			 console.log(girades);
			 console.log(cardsPlaying);
				 let totalcartes = l_partida.girada.length;
				 let eliminat = false;
				 let j = 0;
			     let k = 0;
			 for (var n = 0; n < this.numbercards * 2; n++) {
				 this.add.image(pos, 300, cardsPlaying[n]);
				 pos += 100;
			 }
				 pos = 250;
				 while(j < totalcartes) {
				 	while(eliminat !== true && k<cardsPlaying.length) {

						if (cardsPlaying[k] === girades[j]) {
							   eliminat = true;
							   cardsPlaying.splice(k,1);
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
				 while(k<cardsPlaying.length){
					 this.cards.create(pos, 300, 'back');
					 pos += 100;
					 k += 1;
				 }
			 console.log(cardsPlaying);
		 }
		 else{
			 for (var k = 0; k < this.numbercards * 2; k++) {
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
				girades.push(card.card_id);
				if (this.firstClick){
					if (this.firstClick.card_id !== card.card_id){
						if(this.difficulty === "easy") this.score -= 20;
						else if (this.difficulty === "normal") this.score -= 30;
						else this.score -= 40;
						this.time.delayedCall(1000, () =>
						{
							card.enableBody(false, 0, 0, true, true);
							this.firstClick.enableBody(false, 0, 0, true, true);
							girades.pop();
							girades.pop();
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

	    save_game() {
		let joc = {
			score: this.score,
			correct: this.correct,
			firstClick: this.firstClick,
			cardsPlaying: cardsPlaying,
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



