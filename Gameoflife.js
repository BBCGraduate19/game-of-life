"use strict"
/*
	Game of Life Implementation for BBC Graduate Scheme 2019
	
	Implemented using a 2D grid approach with wraparound edges to simulate an infinite grid.

	1. Creation of arrays to hold a 2d grid data structure. (Size is user-defined)
	2. Populate grid using a user triggered randomized process or three horizontal live cell seed (Scenario 6).
	3.1 A game loop to cycle through the generations 
	3.2 Within Loop, use the rules provided to birth, destroy or keep cells.
	3.3 User toggled method of border handling (infinite or dead cell border)
	4. Each generation game board output to html5 canvas.
	
	CODE LAYOUT:
		GLOBAL VARIABLES
		INITILIZATION FUNCTIONS
		SEEDING FUNCTIONS
		ITERATION FUNCTIONS
		GAME RULES FUNCTIONS
		CANVAS FUNCTIONS
		EVENT HANDLERS
	END
*/

//GLOBAL VARIABLES

let columns = 0, rows = 0;
let generationCounter = 0;
let aliveCellCount = 0;
let deadCellCount = 0;
let canvas, ctx;
let stopSimulation = true;
let infiniteMode = true;

let gameBoard;			
let transitionBoard;	//ensures cell rules apply to current generation

//END OF GLOBAL VARIABLES

//INITILIZATION FUNCTIONS


/*
	window.onload function
	
	@desc - Initializes canvas variables and fits canvas to screen.
	@param - none
	@return - array
*/
window.onload = function(){
	canvas = document.getElementById("canvas");//html has loaded.
	ctx = canvas.getContext("2d");
	document.getElementById("stepbutton").disabled = true;
	document.getElementById("startloopbutton").disabled = true;
	canvas.width = (window.innerHeight/10)*7;		//set default size of canvas
	canvas.height = (window.innerHeight/10)*7;
}

/*
	create2DGameBoard function
	
	@desc - creates 2d grid data structure. Implements 1
	@param - columns: width of grid to create 
	@return - The "multi-dimensional" array data structure used to represent a 2D grid
*/
function create2DGameBoard(columns){
	let array = [];
	for (let i = 0; i < columns; i++){
		array[i] = [];	
	}
	return array;	//Returns a Javascript implementation of a multi-dimensional array
}

//SEEDING FUNCTIONS


/*
	threeCellPopulate function
	
	@desc - Populates board with three cells in a horizontal line as close to the centre as possible, as described in scenario 6. Implements 2.
	@param - none
	@return - none

*/
function threeCellPopulate(){
	columns = Math.round(document.getElementById("columnsinput").value); //ensures integer from user input
	rows = Math.round(document.getElementById("rowsinput").value);
	if (columns == 0 || rows == 0){
		alert("Please select a valid column and row value.");	//if trying to create 0x0 grid	
	} else {
		generationCounter = 0;
		aliveCellCount = 0;
		deadCellCount = 0;
		gameBoard = create2DGameBoard(columns);	//create gameBoard structure from arrays
		transitionBoard = create2DGameBoard(columns);
		let centrex = Math.floor((columns-1)/2);		//find as close to the centre as possible. 
		let centrey = Math.floor((rows-1)/2);		//floor rounding to resolve odd numbers
		for (let i = 0;i < columns; i++){		
			for (let j=0; j < rows; j++){
				gameBoard[i][j] = 0;		//fill board with dead cells
				deadCellCount++;
			}
		}
		gameBoard[centrex][centrey] = 1;		//birth centre
		gameBoard[centrex-1][centrey] = 1;		//birth left of centre
		gameBoard[centrex+1][centrey] = 1;		//birth right of centre
		aliveCellCount = aliveCellCount + 3;
		deadCellCount = deadCellCount - 3;
		canvasSetup();
	}
}

/* 
	populateBoard function
	
	@desc - Randomly assigns 0 or 1 to all cells in grid. Implements 2.
	@param - none
	@return - none
*/
function populateBoard(){
	columns = Math.round(document.getElementById("columnsinput").value); //ensures integer from user input
	rows = Math.round(document.getElementById("rowsinput").value);
	if (columns == 0 || rows == 0){
		alert("Please select a valid column and row value.");	//if trying to create 0x0 grid	
	} else {
		generationCounter = 0;
		aliveCellCount = 0;
		deadCellCount = 0;
		gameBoard = create2DGameBoard(columns);
		transitionBoard = create2DGameBoard(columns);
		for (let i = 0;i < columns; i++){		//nested for loops iterate through the grid
			for (let j=0; j < rows; j++){
				gameBoard[i][j] = Math.round(Math.random());	//assign random value (0 or 1)
				if (gameBoard[i][j] == 1){
					aliveCellCount++;
				} else {
					deadCellCount++;
				}
			}
		}
		canvasSetup(); //call to canvas functions
	}
}

//ITERATIVE FUNCTIONS
/*
	gameLoop function
	
	@desc - Main loop of application, calls functions to implement game rules, then calls itself to loop. Implements 3.1
	@param - none
	@return - none
*/
function gameLoop(){
	aliveCellCount = 0;
	deadCellCount = 0;
	nextGeneration();
	generationCounter++;
	drawBoard();
	document.getElementById("statsbar").innerHTML = ("Generation: " + generationCounter + 
													"Live Cells: " + aliveCellCount + " Dead Cells: " + deadCellCount + 
													" Total Cells: " + (deadCellCount+aliveCellCount));
	if (!stopSimulation){		//check if game should keep looping
		requestAnimationFrame(gameLoop);
	}
}

//GAME RULES FUNCTIONS


/*
	nextGeneration function
	
	@desc - Creates new generation cells using defined rules. Implements 3.2
	@param - none
	@return - none
*/
function nextGeneration() {
	for (let i = 0; i < columns; i++){	//iterate through grid.
		for (let j = 0; j < rows; j++){
			//find and add value of neighbours to determine what rules this cell should follow
			let neighbours = 0;
			neighbours += getNeighbourValue(i-1,j-1); //get value of NW neighbour, also handles border conditions. See function for detail
			neighbours += getNeighbourValue(i,j-1); //N
			neighbours += getNeighbourValue(i+1,j-1); //NE
			neighbours += getNeighbourValue(i-1,j); //W
			neighbours += getNeighbourValue(i+1,j); //E
			neighbours += getNeighbourValue(i-1,j+1); //SW
			neighbours += getNeighbourValue(i,j+1); //S
			neighbours += getNeighbourValue(i+1,j+1); //SE
			//Apply game rules to cells
			if (gameBoard[i][j] == 0){ //If cell is dead
				if (neighbours == 3){  
					transitionBoard[i][j] = 1; //If dead cell has only three live neighbours, birth
				} else {
					transitionBoard[i][j] = 0; //if not, remain dead
				}
			} else if (gameBoard[i][j] == 1){ //else if cell is alive
				switch (neighbours){	//action dependant upon amount of neighbours
					case 0:
					case 1:
						transitionBoard[i][j] = 0; //Under population, dies
						break;
					case 2:
					case 3:
						transitionBoard[i][j] = 1; //Survival, remains alive
						break;
					case 4:
					case 5:
					case 6:
					case 7:
					case 8:
						transitionBoard[i][j] = 0; //Over population, dies
						break;	
					default:
						transitionBoard[i][j] = 0;
				}
			}
		}
	}
	//Once grid traversal complete, copy transitional grid to the live canvas grid
	for (let i = 0; i < columns; i++){	//iterate grid
		for (let j = 0; j < rows; j++){
			if (transitionBoard[i][j] == 0){
				deadCellCount++;
			} else {
				aliveCellCount++;
			}
			gameBoard[i][j] = transitionBoard[i][j]; //overwrite cell
		}
	}
}

/*
	getNeighbourValue function
	
	@desc - returns value of neighbour cell, either wraparound or border. Implements 3.3
	@param - x: x-position of neighbour cell to be processed, y: y-position of neighbour cell to be processed
	@return - return value of neighbour cell
	
	@ISSUE - Function treating border as dead cells - 28/01/2019
	@RESOLVED -  Wraparound method implemented, Toggle-able due to smaller grid sizes - 29/01/2019
*/
function getNeighbourValue(x, y){
	//if there should be a border
	if (!infiniteMode){	
		if (x < 0 || x > columns-1){			
			return 0;	//if x is less than 0 or x is more than amount of columns, off-grid, treat as dead
		} else if (y < 0 || y > rows-1){	
			return 0;	//same for y with rows
		} else {
			return gameBoard[x][y];	//neighbour is within grid
		}
	}else {
		//else infinite wraparound
		if (x < 0){	
			return gameBoard[columns + x][y];//if x is negative, adding to columns will return far right side as neighbour
		} else if (x > columns-1){			
			return gameBoard[0][y]; //else if x is more than amount of columns, treat far left as neighbour
		} else if (y < 0){
			return gameBoard[x][rows + y]; //same with y for rows
		}else if(y > rows-1){
			return gameBoard[x][0];
		} else {
			return gameBoard[x][y]; //else neighbour is within grid, return the value without change.
		}
	}
}

//CANVAS FUNCTIONS


/*
	canvasSetup function
	
	@desc - Called by seeding functions to configure canvas to fit grid ratio, reducing off-grid white space
	@param - none
	@return - none

*/
function canvasSetup(){
	canvas.width = (window.innerHeight/10)*7;		//reset size of canvas from pervious iteration
	canvas.height = (window.innerHeight/10)*7;
	if (columns > rows){
		canvas.height = canvas.height/(columns/rows);	//if canvas to wide, reduce width
	} else if (rows > columns){
		canvas.width = canvas.width/(rows/columns);		//if canvas to tall, reduce height
	}
	//if grid sides equal, do nothing
	document.getElementById("statsbar").innerHTML = ("Generation: " + generationCounter + 
													"Live Cells: " + aliveCellCount + " Dead Cells: " + deadCellCount + 
													" Total Cells: " + (deadCellCount+aliveCellCount));
	document.getElementById("stepbutton").disabled = false;
	document.getElementById("startloopbutton").disabled = false;
	drawBoard();
	
}

/*
	drawBoard function
	
	@desc - Draws and scales grid to canvas. Implements 4
	@param - none
	@return - none
*/
function drawBoard(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	let scalefactorx = canvas.width/columns;	//how much larger canvas needs to be to fit required elements
	let scalefactory = canvas.height/rows;
	let scale = (scalefactory < scalefactorx ? scalefactory : scalefactorx); 
	/*
		if columns > rows, widen canvas scale, squeeze rows.
	*/
	for (let i = 0; i < columns; i++){
		for (let j = 0; j < rows; j++){
			let xscale = i * scale;
			let yscale = j * scale;
			if(gameBoard[i][j] == 1){
				ctx.fillStyle = "#87CEEB";
				ctx.fillRect(xscale,yscale,scale,scale);
			}
		}
	}
}

//EVENT HANDLERS


/*
	startGame function
	
	@desc -  Begins loop for the first time. Updates interface to reflect this.
	@event - Called by onclick event on "startloopbutton" button,
	@param - none
	@return - none
*/
function startGame(){
	generationCounter = 0;
	stopSimulation = false;
	document.getElementById("pauseloopbutton").style.display = "block";
	document.getElementById("startloopbutton").style.display = "none";
	document.getElementById("populatebutton").disabled = true;
	document.getElementById("populatebutton").innerHTML = "Reset disabled while looping";
	document.getElementById("populatethreebutton").disabled = true;
	document.getElementById("populatethreebutton").innerHTML = "Disabled while looping";
	gameLoop();
}

/*
	takeStep function
	
	@desc -  Iterates loop once. Updates interface to reflect this.
	@event - Called by onclick event on "stepbutton" button,
	@param - none
	@return - none
*/
function takeStep(){
	stopSimulation = true; //stop loop after one iteration
	document.getElementById("pauseloopbutton").style.display = "block";
	document.getElementById("startloopbutton").style.display = "none";
	document.getElementById("populatebutton").disabled = false;
	document.getElementById("populatebutton").innerHTML = "Random Repopulate";
	document.getElementById("populatethreebutton").disabled = false;
	document.getElementById("populatethreebutton").innerHTML = "Three Live Horizontal Cell Seed (As in Scenario 6)";
	gameLoop();
}

/*
	toggleGameLoop function
	
	@desc - Stops iteration of gameLoop or resumes iteration of gameLoop
	@event - Called by onclick event on "pauseloopbutton" button
	@param - none
	@return - none
*/
function toggleGameLoop(){
	if (stopSimulation){
		stopSimulation = false;
		gameLoop();
		document.getElementById("populatebutton").disabled = true;
		document.getElementById("populatebutton").innerHTML = "Disabled while looping";
		document.getElementById("populatethreebutton").disabled = true;
		document.getElementById("populatethreebutton").innerHTML = "Disabled while looping";
	}else{
		stopSimulation = true;
		document.getElementById("populatebutton").disabled = false;
		document.getElementById("populatebutton").innerHTML = "Random Repopulate";
		document.getElementById("populatethreebutton").disabled = false;
		document.getElementById("populatethreebutton").innerHTML = "Three Live Horizontal Cell Seed (As in Scenario 6)";
	}
}

/*
	restartGame function
	
	@desc - Stops a current game if one is running, then repopualtes gameBoard using chosen method.
	@event - Called by an onclick event on both populate buttons
	@param - gameType: Integer used to indicate user button choice of population method (0: Three cell or 1: Populate), 
			 NOT Boolean to ease possible expansion of choices
	@return - none
	
	@ISSUE - Repeat of code 
	@RESOLVED - gameType check AFTER stopSimulation check, no longer repeat of exact code.
*/
function restartGame(gameType){
	document.getElementById("pauseloopbutton").style.display = "none";
	document.getElementById("startloopbutton").style.display = "block";
	if (!stopSimulation){
		toggleGameLoop();
	}
	if (gameType == 0){
		threeCellPopulate();
	} else if (gameType == 1){
		populateBoard();
	}
}

/*
	toggleBorderMode function
	
	@desc - Changes behaviour of getNeighbourValue function, switches between border logic and infinite logic.
	@event - Called by onclick event on "bordermodebutton" button
	@param - none
	@return - none
*/
function toggleBorderMode(){
	if (infiniteMode){
		infiniteMode = false;
		document.getElementById("bordermodebutton").innerHTML = "Dead Cell Border";
	} else {
		infiniteMode = true;
		document.getElementById("bordermodebutton").innerHTML = "Infinite Grid (Wraparound)";
	}
}

//END OF EVENT HANDLERS

//End of JS