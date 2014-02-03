// Application Script

/*	
THIS IS A DRAFT OF THE GAME OF LIFE.
I AM KEEPING THE RANDOM WALK DUDER BECAUSE IT'S EASIER NOT TO REMOVE AND JUST COPY ISOMETRIC ACROSS.
LIFE IS RUN INSIDE THE DUDER OBJECT USING TILEKEEPER ARRAY WITH EXPANDED DATA.
*/

enchant(); // declares the use of enchant.js

//Stage Variables
var stageWidth = 800;
var stageHeight = 600;

var tileWidth = 30;
var tileHeight = 30;
var tileSize = 20;

var tileKeeper = new Array();

var frameCycle = 0;
var framesPerIterate = 20;			//game of life iteration speed compared to fps
var iterationCount = 0;
var thisIteration = 2;			//index of cell data, initially the present state
var nextIteration = 3;			//alternate index, initially used for the new state

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
	game.fps = 20;

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
            	var nextY = (stageHeight/2) + (i * (tileSize*.6) / 2) - (j * (tileSize*.6) / 2);

                gridImage.context.moveTo( nextX, nextY );
                gridImage.context.lineTo( nextX + (tileSize/2), nextY + (tileSize*.6)/2 );
                gridImage.context.lineTo( nextX, nextY + (tileSize*.6) );
                gridImage.context.lineTo( nextX - (tileSize/2), nextY + (tileSize*.6)/2 );
                gridImage.context.lineTo( nextX, nextY );

                tileKeeper[i].push(new Array(nextX,nextY,0,0) );		//each tile has x,y screen coordinates, cell status (0 or 1), and an alternate used during iteration
        	}
		}

		initConditions(tileKeeper);		//set the starting cell pattern

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
					this.frame = [thisIteration];
					break;

				case 3: // move southWest
					this.currentTileY += 1;
					this.frame = [nextIteration];

					break;

				case 4: // move northEast
					this.currentTileX -= 1;
					this.frame = [1];

					break;

			}

			//Wrap around
			if (this.currentTileX < 0){
				this.currentTileX = tileKeeper.length-2;		//why is tileKeeper length 31 and not 30??
			} else if (this.currentTileX > tileKeeper.length-2){
				this.currentTileX = 0;
			}

			if (this.currentTileY < 0){
				this.currentTileY = tileKeeper[this.currentTileX].length-1;
			} else if (/* you had this as this.currentTileX ---> */this.currentTileY > tileKeeper[this.currentTileX].length-1){		//fixed it
				this.currentTileY = 0;
			}

			//Update screen location from tile position
			this.x = tileKeeper[this.currentTileX][this.currentTileY][0];
			this.y = tileKeeper[this.currentTileX][this.currentTileY][1];

			//console.log('stuck?  ' + this.currentTileX + ' , ' + this.currentTileY);		//trying to debug getting stuck

			//Heatmap of path taken
			gridImage.context.beginPath();
			gridImage.context.moveTo( this.x, this.y );
                		gridImage.context.lineTo( this.x + (tileSize/2), this.y + (tileSize*.6)/2 );
                		gridImage.context.lineTo( this.x, this.y + (tileSize*.6) );
                		gridImage.context.lineTo( this.x - (tileSize/2), this.y + (tileSize*.6)/2 );
                		gridImage.context.lineTo( this.x, this.y );
			gridImage.context.closePath();

			gridImage.context.fillStyle = 'rgba(0,0,0,.1)';
			gridImage.context.fill();
			isoBackGrid.image = gridImage;

			//___Game of life___
			/*
			if (frameCycle === framesPerIterate) {
				frameCycle = 1;
				iterationCount++;
				var neighbors = 0;
				for (i = 0; i < tileKeeper.length; i++){
				for (j = 0; j < tileKeeper[i].length; j++){
					for (ii = -1; ii < 2; ii++){
					for (jj = -1; jj < 2; jj++){
						if (i + ii <= tileKeeper.length && j + jj <= tileKeeper[i].length){
							if (tileKeeper[i + ii][j + jj][thisIteration] === 1){
							neighbors++;					//count surrounding live cells
							}
						}
					}}
					if (neighbors < 2){				//apply evolution rules and record result in alternate index
						tileKeeper[i][j][nextIteration] = 0;
					} else if (neighbors > 3){
						tileKeeper[i][j][nextIteration] = 0;
					} else if (neighbors === 3){
						tileKeeper[i][j][nextIteration] = 1;
					}
					neighbors = 0;
				}}

				//color cells with new state
				for (i = 0; i < tileKeeper.length; i++){
				for (j = 0; j < tileKeeper[i].length; j++){
					gridImage.context.beginPath();
					gridImage.context.moveTo( this.x, this.y );
	                			gridImage.context.lineTo( this.x + (tileSize/2), this.y + (tileSize*.6)/2 );
	                			gridImage.context.lineTo( this.x, this.y + (tileSize*.6) );
	                			gridImage.context.lineTo( this.x - (tileSize/2), this.y + (tileSize*.6)/2 );
	                			gridImage.context.lineTo( this.x, this.y );
					gridImage.context.closePath();
					if (tileKeeper[i][j][nextIteration] === 0){
						gridImage.context.fillStyle = "#fff";
						gridImage.context.fill();
					} else if (tileKeeper[i][j][nextIteration] === 1) {
						gridImage.context.fillStyle = "#000";
						gridImage.context.fill();
					}
				}}
				var swapIterationIndex = nextIteration;			//swap cell data index for next iteration
				nextIteration = thisIteration;
				thisIteration = swapIterationIndex;
			} else {
				frameCycle++;
			}*/

    		

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

//Initialize the life grid
function initConditions(grid)
{
	var percentAlive = .50;		//50% of the cells will randomly start as alive
	for (i = 0; i < grid.length; i++){
		for (j = 0; j < grid[i].length; j++){
			if (Math.random()<percentAlive) {
				grid[i][j][thisIteration] = 1;
				grid[i][j][nextIteration] = 1;
			{
		}
	}
}
