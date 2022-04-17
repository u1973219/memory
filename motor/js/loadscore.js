"use strict";

//carrega a guardats l'array de localstorage.partides que guarda els scores que obtenim en el mode de joc de survival

var load_obj = function(){
    var vue_instance = new Vue({
        el: "#ranquing",
        data: {
            guardats: []
        },
        created: function(){
            let arrayPartides = [];
            if(localStorage.partides){
                arrayPartides = JSON.parse(localStorage.partides);
                if(!Array.isArray(arrayPartides)) arrayPartides = [];
            }
            arrayPartides.sort(function(a, b){return b-a});
            this.guardats = arrayPartides;
        }
    });
    return {};
}();
