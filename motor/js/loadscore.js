"use strict";


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
