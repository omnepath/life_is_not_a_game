// Application Script


enchant(); // declares the use of enchant.js

//Stage Variables
var stageWidth = 800;
var stageHeight = 600;
var gridSpacing = 10;

//Lifeform Class
Lifeform = Class.create(Sprite, {
    initialize: function() {

        this.x = stageWidth/2 - gridSpacing/2;
        this.y = stageHeight/2 - gridSpacing/2;

        this.width = gridSpacing;
        this.height = gridSpacing;

    },

    onenterframe: function() {
        
    	this.x += gridSpacing;
	    
    }
});


//Begin game code
window.onload = function(){ // run this function after the window has been loaded

	game = new Core(stageWidth+1,stageHeight+1); // create a new game with resolution of 320x320
	game.fps = 12;

	//Preload resources
	game.preload('img/Lifeform-rubineRed.png'); // specifies which image files should be loaded when the game starts

	game.onload = function(){ // describes what should be executed when the game starts

		//Draw the grid background
		backgroundGrid = new Sprite(stageWidth+1, stageHeight+1); 	// Create a new sprite to store the grid (+1 adds the last line to the grid)
		var gridImage = new Surface(stageWidth+1, stageHeight+1); 	// Create a new surface, which is like a sprite but allows canvas draw api
		gridImage.context.strokeStyle = "rgba(0, 0, 0, 0.3)"; 		// Set the color of the grid lines
		gridImage.context.lineWidth = 1;							// Set the width of the grid lines
		for (var j = 0; j <= stageWidth+gridSpacing+90; j += gridSpacing) {
				gridImage.context.moveTo(0.5 + j, 0);					// Defines where the drawing should start.
				gridImage.context.lineTo(0.5 + j, stageHeight);			// Defines where the line is drawn and ends.
		}
		for (var i = 0; i <= stageHeight+gridSpacing+90; i += gridSpacing) {				  
				gridImage.context.moveTo(0, 0.5 + i);
				gridImage.context.lineTo(stageWidth, 0.5 + i);
		} 
		gridImage.context.stroke();								   // Actually draw all the lines
		backgroundGrid.image = gridImage;						   // Set the sprite image to the new grid image
		game.rootScene.addChild(backgroundGrid);				   // Add the grid to stage


		var redLifeform = new Sprite(10,10);
		redLifeform.x = stageWidth/2;
        redLifeform.y = stageHeight/2;
        redLifeform.width = gridSpacing;
        redLifeform.height = gridSpacing;
		redLifeform.image = game.assets['img/Lifeform-rubineRed.png'];
		redLifeform.addEventListener('enterframe', function() {

			var randomPath = randomIntFromInterval(1,4);

			switch (randomPath){

				case 1:
					this.y -= gridSpacing;
					this.rotation=180;
					break;

				case 2:
					this.x += gridSpacing;
					this.rotation=270;
					break;

				case 3:
					this.y += gridSpacing;
					this.rotation=0;
					break;

				case 4:
					this.x -= gridSpacing;
					this.rotation=90;
					break;

			}


    		if (this.x > stageWidth){
    			this.x = 0;
    		} else if (this.x < 0){
    			this.x = stageWidth-1-gridSpacing;
    		}

    		if (this.y > stageHeight){
    			this.y = 0;
    		} else if (this.y < 0){
    			this.y = stageHeight-1-gridSpacing;
    		}

        });
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
