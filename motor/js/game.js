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




class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
		this.cards = null;
		this.firstClick = null;
		this.score = 100;
		this.correct = 0;
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
	
    create (){
		let arraycards = ['co', 'cb','sb','so','tb','to'];
		let numbercards = options_game.cards;
		let difficulty = options_game.dificulty;
		var cardsPlaying = [];

		shuffle(arraycards);
		for (var j = 0;j < numbercards; j++){
			cardsPlaying.push(arraycards[j]);
			cardsPlaying.push(arraycards[j]);
		}
		shuffle(cardsPlaying);



		this.cameras.main.setBackgroundColor(0xBFFCFF);

		let pos = 250;
		this.cards = this.physics.add.staticGroup();

		for(var k=0;k<numbercards*2;k++){
			this.add.image(pos, 300, cardsPlaying[k]);
			this.cards.create(pos, 300, 'back');
			pos+=100;
		}
		
		let i = 0;
		this.cards.children.iterate((card)=>{
			card.card_id = cardsPlaying[i];
			i++;
			card.setInteractive();
			card.on('pointerup', () => {
				card.disableBody(true,true);
				if (this.firstClick){
					if (this.firstClick.card_id !== card.card_id){
						if(difficulty === "easy") this.score -= 20;
						else if (difficulty === "normal") this.score -= 30;
						else this.score -= 40;
						setTimeout(() =>{
							card.enableBody(false, 0, 0, true, true);
							//this.firstClick.enableBody(false, 0, 0, true, true);
						},1000);
						this.firstClick.enableBody(false, 0, 0, true, true);
						if (this.score <= 0){
							alert("Game Over");
							loadpage("../");
						}
					}
					else{
						this.correct++;
						if (this.correct >= numbercards){
							alert("You Win with " + this.score + " points.");
							loadpage("../");
						}
					}
					this.firstClick = null;
				}
				else{
					this.firstClick = card;
				}
			}, card);
		});
	}
	
	update (){	}
}

