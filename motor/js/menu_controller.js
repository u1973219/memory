"use strict";

//function start_game(){
//	name = prompt("User name");
	
//	sessionStorage.setItem("username", name);
	
//	loadpage("./html/game.html");
//}

function phaser_game(){
	loadpage("phasergame.html");
}
function phaser_game2(){
	loadpage("phasergame2.html");
}

function exit (){
	if (name != ""){
		alert("Leaving " + name + "'s game");
	}
	name = "";
}

function options(){
	loadpage("./html/options.html");
}

function load(){
	loadpage("./html/load.html");
}

