'use strict';
var unit = require("./units.js");

var map = function(game, stats){
    this.game = game;
    this.stats = stats;
    this.map = this.game.add.tilemap('level_01');
    this.map.addTilesetImage('Tile-set');
    this.map.addTilesetImage('Colored_Tiles')
    this.BackgroundLayer = this.map.createLayer("Background");
    this.GroundLayer = this.map.createLayer("Ground");
    this.ForegroundLayer = this.map.createLayer("Foreground");

    //Units group
    this.rFarms = 0;
    this.yFarms = 0;
    this.unitsArray = new Array(this.map.height);
    this.createUnitsArray();

    //Scale
    this.BackgroundLayer.scale.set(1.8);
    this.GroundLayer.scale.set(1.8);
    this.ForegroundLayer.scale.set(1.8);
    
    this.BackgroundLayer.resizeWorld();
    this.GroundLayer.resizeWorld();
    this.ForegroundLayer.resizeWorld();

    //AUX
    this.turn = 0;
};

map.prototype.createUnitsArray = function(){
    for (let index = 0; index < this.unitsArray.length; index++) {
        this.unitsArray[index] = new Array(this.map.width);
    }

    for (let index1 = 0; index1 < this.map.height; index1++)
        for (let index2 = 0; index2 < this.map.width; index2++) 
            this.unitsArray[index1][index2] = -1;

    this.unitsArray[7][5] = new unit (-20);
    this.unitsArray[11][22] = new unit (-10);
};

map.prototype.createUnit = function(x,y,unitType){
    this.unitsArray[y][x] = new unit (unitType);
};

map.prototype.AmountOfTiles = function (index){
    var count = 0;
    for (let indexw = 0; indexw < this.map.width; indexw++) {
        for (let indexh = 0; indexh < this.map.height; indexh++) { 
            if (this.map.getTile(indexw,indexh,this.GroundLayer, true).index == index) {
                count ++;
            }
        }        
    }
    return count;
}
map.prototype.UpdateMap = function(currentPlayer) {
    this.UpdateTrees();
    this.resetUnits();
};

map.prototype.GameOver = function(){
    console.log(this.map.getTile(5,7,this.ForegroundLayer,true).index + " / " + this.map.getTile(22,11,this.ForegroundLayer,true).index);
    if  (this.map.getTile(5,7,this.ForegroundLayer,true).index != 48 || this.map.getTile(22,11,this.ForegroundLayer,true).index != 45) //Red wins || Yellow wins
        this.game.state.start('EndGame');
}

map.prototype.DestroyArmy = function(player){
    for (let index1 = 0; index1 < this.map.height; index1++)
        for (let index2 = 0; index2 < this.map.width; index2++){
            if(this.unitsArray[index1][index2] != -1){
                if(this.unitsArray[index1][index2].player == player)
                if(this.stats.IsUnit(this.map.getTile(index2, index1, this.ForegroundLayer, true).index)){
                    this.unitsArray[index1][index2] = -1;
                    this.map.removeTile(index2,index1,this.ForegroundLayer);
                }        
            }          
        }
}

            

map.prototype.UpdateTrees = function(){

    for(var y = 0; y < this.map.height; y ++){
        for(var x = 0; x < this.map.width; x ++){
           if(this.map.getTile(x,y, this.ForegroundLayer,true).index == 5)  //Si es árbol
           {
                if(Math.random() < this.stats.treeGrowRatio)  //Probabilidad de que aparezca otro árbol
                {
                    var newTreePosX = 0;
                    var newTreePosY = 0;
                    var rnd = Math.random();

                    if(rnd <= 0.25){
                        newTreePosY = -1;   //Arriba
                    }
                    else if(rnd <= 0.5){
                        newTreePosY =  1;    //Abajo
                    }
                    else if(rnd <= 0.75){
                        newTreePosX = - 1;    //Izquierda
                    }
                    else{                        
                        newTreePosX = 1;     //Derecha
                    }

                    var nextPosElem = this.map.getTile(x + newTreePosX , y + newTreePosY, this.BackgroundLayer,true).index;

                    if( nextPosElem == 3 || nextPosElem == 1) //Es hierba sin nada encima
                    {
                        if(this.map.getTile(x + newTreePosX , y + newTreePosY, this.ForegroundLayer,true).index == -1)
                        {
                            this.map.putTile(5, x + newTreePosX, y + newTreePosY, this.ForegroundLayer);    //Convierte en árbol
                        }
                    }
                }
           }
        }
    }
}

map.prototype.nearAlliedTerritory = function(point, currentPlayer) {    //Check if near the given point are there any allied tiles
    if(currentPlayer){  //Red player
        if(this.map.getTile(point.x -1, point.y, this.GroundLayer,true).index == 365)
            return true;
        if(this.map.getTile(point.x , point.y -1, this.GroundLayer,true).index == 365)
            return true;
        if(this.map.getTile(point.x , point.y +1, this.GroundLayer,true).index == 365)
            return true;
        if(this.map.getTile(point.x +1, point.y, this.GroundLayer,true).index == 365)
            return true;
        return false;
    }
    else{   //Yellow player
        if(this.map.getTile(point.x -1, point.y, this.GroundLayer,true).index == 366)
            return true;
        if(this.map.getTile(point.x , point.y -1, this.GroundLayer,true).index == 366)
            return true;
        if(this.map.getTile(point.x , point.y +1, this.GroundLayer,true).index == 366)
            return true;
        if(this.map.getTile(point.x +1, point.y, this.GroundLayer,true).index == 366)
            return true;
        return false;
    }
    
}

map.prototype.PlaceUnit = function(clickPoint, type, currentPlayer){
    this.placed = false;
    this.teamTile = this.map.getTile(clickPoint.x, clickPoint.y, this.GroundLayer,true).index;      //Coloured tile under entity
    this.entity = this.map.getTile(clickPoint.x, clickPoint.y,this.ForegroundLayer,true).index;     //Entity selected
    this.terrain = this.map.getTile(clickPoint.x, clickPoint.y,this.BackgroundLayer,true).index;    //Terrain
   
    if(!this.stats.IsUnit(type))  //If it is an structure
    {
        if(currentPlayer)               //If red player
        {
            if(this.teamTile == 365)    //If it is a red territory
            {
                this.placed = this.freeThenPlace(clickPoint, type, currentPlayer);    //Place?
            }  
        }    
        else                            //If yellow player
         {
            if(this.teamTile == 366)    //If it is a yellow territory
            {
                this.placed = this.freeThenPlace(clickPoint, type, currentPlayer);    //Place?
            }
         }
        if(this.placed) //If the structure was placed and it is a farm, it is added to the farms count
        {
            if(type == this.stats.farmIndexRed)
                this.rFarms ++;
            else if(type == this.stats.farmIndexYellow)
                this.yFarms ++;
        }
    }
    else{
        //(this.nearAlliedTerritory(clickPoint, currentPlayer)) //If near to allied territory
        //{
            this.placed = this.freeThenPlace(clickPoint, type, currentPlayer);
            if(this.placed)
                this.unitsArray[clickPoint.y][clickPoint.x].moved = true;
        //}
    }
    return this.placed;    
}

map.prototype.freeThenPlace = function(clickPoint, type, currentPlayer){
    if(this.terrain == 3 || this.terrain == 1) //Es hierba
        if(this.entity == -1){ //Nada ocupado
            if (currentPlayer) 
            this.map.putTile(365,clickPoint.x,clickPoint.y,this.GroundLayer);
        
            else
            this.map.putTile(366,clickPoint.x,clickPoint.y,this.GroundLayer);
    
            this.createUnit(clickPoint.x,clickPoint.y,type);
            this.map.putTile(type, clickPoint.x, clickPoint.y, this.ForegroundLayer);
            return true;
        }
        return false;
    }

map.prototype.isMoved = function (point){
    if (this.unitsArray[point.y][point.x].moved)
        return true
    else
        return false;        
}

map.prototype.resetUnits = function (){
    for (let index1 = 0; index1 < this.map.height; index1++)
        for (let index2 = 0; index2 < this.map.width; index2++) 
            if(this.unitsArray[index1][index2] != -1)
                this.unitsArray[index1][index2].moved = false;
}

map.prototype.moveUnit = function(clickPoint, destination, currentPlayer){
    this.map.putTile(this.map.getTile(clickPoint.x,clickPoint.y,this.ForegroundLayer,true).index,clickPoint.x + destination.x, clickPoint.y + destination.y, this.ForegroundLayer);
    this.map.removeTile(clickPoint.x,clickPoint.y,this.ForegroundLayer);
    if (currentPlayer){
        this.map.putTile(365,clickPoint.x + destination.x,clickPoint.y + destination.y,this.GroundLayer);
    }

    else{
        this.map.putTile(366,clickPoint.x + destination.x,clickPoint.y + destination.y,this.GroundLayer);
    }

    this.unitsArray[clickPoint.y + destination.y][clickPoint.x + destination.x] = this.unitsArray[clickPoint.y][clickPoint.x];
    this.unitsArray[clickPoint.y][clickPoint.x] = -1;
    this.unitsArray[clickPoint.y + destination.y][clickPoint.x + destination.x].moved = true;
}

map.prototype.NotDefended = function (selectedPoint ,destinationPoint, currentPlayer){
    var defenderStrength = 0;

    defenderStrength = this.Tower(destinationPoint.x, destinationPoint.y - 1, currentPlayer)
    if(defenderStrength != -1)
        if(this.GetStrength(selectedPoint) < defenderStrength)
            return false;
    defenderStrength = this.Tower(destinationPoint.x + 1, destinationPoint.y, currentPlayer)
    if(defenderStrength != -1)
        if(this.GetStrength(selectedPoint) < defenderStrength)
            return false;
    defenderStrength = this.Tower(destinationPoint.x, destinationPoint.y + 1, currentPlayer)
    if(defenderStrength != -1)
        if(this.GetStrength(selectedPoint) < defenderStrength)
            return false;
    defenderStrength = this.Tower(destinationPoint.x - 1, destinationPoint.y, currentPlayer)
    if(defenderStrength != -1)
        if(this.GetStrength(selectedPoint) < defenderStrength)
            return false;
    
    return true;
}

map.prototype.Tower = function (x,y, currentPlayer){
    if(currentPlayer){
        if(this.map.getTile(x, y, this.ForegroundLayer, true).index == this.stats.towerIndexYellow)
            return this.stats.towerStrength;
        else if(this.map.getTile(x, y, this.ForegroundLayer, true).index == this.stats.fortressIndexYellow)
            return this.stats.fortressStrength;
        else
            return -1;
    }
    else{
        if(this.map.getTile(x, y, this.ForegroundLayer, true).index == this.stats.towerIndexRed)
            return this.stats.towerStrength;
        else if(this.map.getTile(x, y, this.ForegroundLayer, true).index == this.stats.fortressIndexRed)
            return this.stats.fortressStrength;
        else
            return -1;
    }
}

map.prototype.FourPos = function (pos, currentPlayer){ //Return an array with the entities on the four direction around a given position
    var fourPos = [0,0,0,0];    //Top, right , down, left
        fourPos [0] = this.WhatIsIt(pos.x, pos.y - 1,true, currentPlayer);
        fourPos [1] = this.WhatIsIt(pos.x + 1, pos.y,true, currentPlayer);
        fourPos [2] = this.WhatIsIt(pos.x, pos.y + 1,true, currentPlayer);
        fourPos [3] = this.WhatIsIt(pos.x - 1, pos.y,true, currentPlayer);
    return fourPos;
}

map.prototype.UnitsManteinance = function(currentPlayer){
    var totalManteinance = 0;

        for (let index1 = 0; index1 < this.map.height; index1++)
        for (let index2 = 0; index2 < this.map.width; index2++) 
            if(this.unitsArray[index1][index2] != -1)
                if(this.unitsArray[index1][index2].player == currentPlayer)
                    totalManteinance += this.unitsArray[index1][index2].maintenance;
    return totalManteinance;
}

map.prototype.WhatIsIt = function (x,y,enemy,currentPlayer){
    var backElem = this.map.getTile(x, y, this.BackgroundLayer, true).index;
    if(backElem != 3 && backElem != 1)  //Beach or water   (Out of game zone)
        return 0;

    else{                               //Inside game zone
        var foreElem = this.map.getTile(x, y, this.ForegroundLayer, true).index;
        if(enemy){
            if (foreElem == 5) //Tree
            return 2;
        else if (foreElem == -1)                //Vacío
            return 1;
        else if(this.stats.IsEnemyUnit(foreElem, currentPlayer) || this.stats.IsEnemyStructure(foreElem, currentPlayer))
                return 3;
        else
            return 0;
        }

        else{
            if (foreElem == 5) //Tree
            return 2;
        else if (foreElem == -1)  //Vacío
            return 1;
        else if(this.stats.IsUnit(foreElem))
            return 3;
        else
            return 0;
        }   
    }
}

map.prototype.GetStrength = function(position){   
    return this.unitsArray[position.y][position.x].strenght;
}

map.prototype.TileIndexGround = function(point){
    return this.map.getTile(point.x, point.y, this.GroundLayer, true).index;
}


map.prototype.TileCenterPos = function(point){
    var pointCenter = new Phaser.Point();
    var tile =  this.map.getTile(point.x, point.y, this.BackgroundLayer);
    pointCenter.x = tile.worldX * 1.8;
    pointCenter.y = tile.worldY * 1.8;
    return pointCenter;
}

module.exports = map;