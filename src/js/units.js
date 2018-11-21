'use strict';

//"units" CREATES THE UNITS ENTITIES OF THE GAME BY USING THE STATS FROM "stats"

var stats = require("./stats.js");

//Player logic color representation
//RED = true - YELLOW = false

var unit = function(type){ 

    this.stats = new stats();

    if(type == this.stats.peasantIndexRed)                                     
        this.Peasant(true);
    else if(type == this.stats.peasantIndexYellow)
        this.Peasant(false);
    else if(type == this.stats.lancerIndexRed)
        this.Lancer(true);
    else if(type == this.stats.lancerIndexYellow)
        this.Lancer(false);
    else if(type == this.stats.swordmanIndexRed)
        this.Swordman(true);
    else if(type == this.stats.swordmanIndexYellow)
        this.Swordman(false);
    else if(type == this.stats.horsemanIndexRed)
        this.Horseman(true);
    else if(type == this.stats.horsemanIndexYellow)
        this.Horseman(false);
}
/*var Peasant = function(player) {

    unit.call(this, this.stats.peasantLife, this.stats.peasantStrength, this.stats.peasantPrice, this.stats.peasantMantenance);

    if (player == "RED")
        this.player = true;
    else
        this.player = false;
}
Peasant.prototype = Object.create(unit.prototype);
Peasant.prototype.constructor = Peasant;

unit.prototype.HasMoney = function(money){
    return money >= this.price;
}*/

unit.prototype.Peasant = function(player){  //PEASANT
    this.name = this.stats.peasantName;
    this.life = this.stats.peasantLife;
    this.strenght = this.stats.peasantStrength;
    this.price = this.stats.peasantPrice;
    this.maintenance = this.stats.peasantMaintenance;

    if (player == "RED")
        this.player = true;
    else
        this.player = false;
}

unit.prototype.Lancer = function(player){   //LANCER
    this.name = this.stats.lancerName;
    this.life = this.stats.lancerLife;
    this.strenght = this.stats.lancerStrength;
    this.price = this.stats.lancerPrice;
    this.maintenance = this.stats.lancerMaintenance;

    if (player == "RED")
        this.player = true;
    else
        this.player = false;
}

unit.prototype.Swordman = function(player){ //SWORDMAN
    this.name = this.stats.swordmanName;
    this.life = this.stats.swordmanLife;
    this.strenght = this.stats.swordmanStrength;
    this.price = this.stats.swordmanPrice;
    this.maintenance = this.stats.swordmanMaintenance;

    if (player == "RED")
        this.player = true;
    else
        this.player = false;
}

unit.prototype.Horseman = function(player){ //HORSEMAN
    this.name = this.stats.horsemanName;
    this.life = this.stats.horsemanLife;
    this.strenght = this.stats.horsemanStrength;
    this.price = this.stats.horsemanPrice;
    this.maintenance = this.stats.horsemanMaintenance;

    if (player == "RED")
        this.player = true;
    else
        this.player = false;
}

module.exports = unit;