'use strict';

var map = function(game){
    this.game = game;
    this.map = this.game.add.tilemap('level_01');
    this.map.addTilesetImage('Tile-set');
    this.BackgroundLayer = this.map.createLayer("Background");
    this.ForegroundLayer = this.map.createLayer("Foreground");

    //Scale
    this.BackgroundLayer.scale.set(1.8);
    this.ForegroundLayer.scale.set(1.8);
};

map.prototype.StuffCounter = function()
{
    console.log("CURRENT GAME STATUS INFO: ");

      var treeCount = 0;
      var mountainCount = 0;
      for(var y = 0; y < this.map.height; y ++){
        for(var x = 0; x < this.map.width; x ++){
           if(this.map.getTile(x,y, this.ForegroundLayer,true).index == 5)
           treeCount++;
           else if(this.map.getTile(x,y, this.ForegroundLayer,true).index == 11)
           mountainCount++;
        }
      }
      console.log("Árbol: " + treeCount);
      console.log("Montaña: " + mountainCount);
};

map.prototype.UpdateMap = function() {
    map.UpdateTrees();
    map.StuffCounter();
};

map.prototype.UpdateTrees = function(){

    for(var y = 0; y < this.map.height; y ++){
        for(var x = 0; x < this.map.width; x ++){
           if(this.map.getTile(x,y, this.ForegroundLayer,true).index == 5)  //Si es árbol
           {
                if(Math.random() < 0.10)  //Probabilidad de que aparezca otro árbol
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

                    if( nextPosElem == 3) //Es hierba sin nada encima
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

module.exports = map;