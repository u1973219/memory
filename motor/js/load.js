"use strict";

var load_obj = function(){
	var vue_instance = new Vue({
		el: "#saves_id",
		data: {
			saves: []
		},
		created: function(){
			let arrayPartides = [];
			if(localStorage.sav){
				arrayPartides = JSON.parse(localStorage.sav);
				if(!Array.isArray(arrayPartides)) arrayPartides = [];
			}
			this.saves = arrayPartides;
		},
		methods: { 
			load: function(i){
				sessionStorage.idPartida = i;
				loadpage("../html/phasergame.html");
			}
		}
	});
	return {}; 
}();

var load_obj_Survival = function(){
	var vue_instance = new Vue({
		el: "#saves_survival",
		data: {
			saves: []
		},
		created: function(){
			let arrayPartides = [];
			if(localStorage.sav2){
				arrayPartides = JSON.parse(localStorage.sav2);
				if(!Array.isArray(arrayPartides)) arrayPartides = [];
			}
			this.saves = arrayPartides;
		},
		methods: {
			load: function(i){
				sessionStorage.idPartida = i;
				loadpage("../html/phasergame2.html");
			}
		}
	});
	return {};
}();