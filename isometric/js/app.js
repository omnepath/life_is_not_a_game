// Application Script


enchant(); // declares the use of enchant.js

//Stage Variables
var stageWidth = 800;
var stageHeight = 600;

var tileWidth = 30;
var tileHeight = 30;
var tileSize = 20;

var tileKeeper = new Array();

//Lifeform Class
Lifeform = Class.create(Sprite, {
    initialize: function() {


    },

    onenterframe: function() {
	    
    }
});


//Begin game code
window.onload = function(){ // run this function after the window has been loaded

	game = new Core(stageWidth+1,stageHeight+1); // create a new game with resolution of 320x320
	game.fps = 15;

	//Preload resources
	game.preload('img/Lifeform-rubineRed-iso.png'); // specifies which image files should be loaded when the game starts

	game.onload = function(){ // describes what should be executed when the game starts

		//Draw the grid background
		isoBackGrid = new Sprite(stageWidth+1, stageHeight+1); 	// Create a new sprite to store the grid (+1 adds the last line to the grid)
		var gridImage = new Surface(stageWidth+1, stageHeight+1); 	// Create a new surface, which is like a sprite but allows canvas draw api
		gridImage.context.strokeStyle = "rgba(0, 0, 0, 0.3)"; 		// Set the color of the grid lines
		gridImage.context.lineWidth = 1;							// Set the width of the grid lines
		
		gridImage.context.beginPath();


		for (i = 0; i < tileWidth; i++){

			tileKeeper[i] = new Array();

    		for (j = tileHeight; j >= 0; j--){  // Changed loop condition here.

    			var nextX = (stageWidth/5) + (j * tileSize / 2) + (i * tileSize / 2);
            	var nextY = (stageHeight/2) + (i * (tileSize*.6) / 2) - (j * (tileSize*.6) / 2)

                gridImage.context.moveTo( nextX, nextY );
                gridImage.context.lineTo( nextX + (tileSize/2), nextY + (tileSize*.6)/2 );
                gridImage.context.lineTo( nextX, nextY + (tileSize*.6) );
                gridImage.context.lineTo( nextX - (tileSize/2), nextY + (tileSize*.6)/2 );
                gridImage.context.lineTo( nextX, nextY );

                tileKeeper[i].push(new Array(nextX,nextY) );


        	}
		}

		console.log(tileKeeper[4][4][1]);

		gridImage.context.stroke();								   // Actually draw all the lines
		isoBackGrid.image = gridImage;						   // Set the sprite image to the new grid image
		game.rootScene.addChild(isoBackGrid);				   // Add the grid to stage


		var redLifeform = new Sprite(10,10);
		redLifeform.x = tileKeeper[4][4][0];
        redLifeform.y = tileKeeper[4][4][1];
        redLifeform.currentTileX = 4;
        redLifeform.currentTileY = 4;
        redLifeform.width = tileSize;
        redLifeform.height = tileSize;
        redLifeform.scale(.5,.5);
		redLifeform.image = game.assets['img/Lifeform-rubineRed-iso.png'];
		redLifeform.addEventListener('enterframe', function() {

			var randomPath = randomIntFromInterval(1,4);

			switch (randomPath){

				case 1: // move northWest
					this.currentTileY -= 1;
					this.frame = [0];
					break;

				case 2: // move southEast
					this.currentTileX += 1;
					this.frame = [2];
					break;

				case 3: // move southWest
					this.currentTileY += 1;
					this.frame = [3];

					break;

				case 4: // move northEast
					this.currentTileX -= 1;
					this.frame = [1];

					break;

			}

			if (this.currentTileX < 0){
				this.currentTileX = tileKeeper.length-1;
			} else if (this.currentTileX > tileKeeper.length-1){
				this.currentTileX = 0;
			}

			if (this.currentTileY < 0){
				this.currentTileY = tileKeeper[this.currentTileX].length-1;
			} else if (this.currentTileX > tileKeeper[this.currentTileX].length-1){
				this.currentTileY = 0;
			}

			this.x = tileKeeper[this.currentTileX][this.currentTileY][0];
			this.y = tileKeeper[this.currentTileX][this.currentTileY][1];




    		

        });

			console.log(tileKeeper);


		game.rootScene.addChild(redLifeform);

	}


	game.start(); // begin the game
}





//Helper functions

//Grabs a random number between two numbers
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
