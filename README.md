# BBC Game of life Candidate Exercise for 2019 Graduate Scheme

## Implemented in JavaScript with a HTML5/CSS Interface


### Brief Overview

Implemented using a 2D grid approach with wraparound edges to simulate an infinite grid. (See Assumptions)

Use HTML file within browser to run the functions.

	1. Creation of arrays to hold a 2d grid data structure. (Size is user-defined)
	2. Populate grid using a user triggered randomized process.
	3.1 A game loop to cycle through the generations 
	3.2 Within Loop, use the rules provided to birth, destroy or keep cells.
	3.3 User toggled method of border handling (infinite or dead cell border)
	4. Each generation game board output to html5 canvas.

### Why JavaScript?

JavaScript was chosen due to a desire to easily output a visual representation of the game of life, in addition, testing was also immediate by simply reloading the page. HTML5 canvas allowed visualisation to be implemented.

The lack of a quick multi-dimensional array creation in JavaScript was considered but is still possible to implement with for loops.

I have experience in JavaScript and would rate it as among my most preferred languages to develop in.

### Assumptions

"Infinite grid":

As the game is played on a 2d grid, the grid shall be considered "infinite" if it meets **ALL** of the following criteria:

  1. The user can set the columns and rows of the grid to any number > 0, even if this results in performance or memory exceptions. 
  2. Regardless of size, the same code handles all input.
  3. Cells on the border still have eight neighbours to implement rules on, but off-grid cells are **NOT** defaulted to dead cells. (No hard border at grid edge)
  
Due to the workflow of the project, both an infinite and dead cell border were retained & implemented and can be changed by the user.

### Testing Conducted

Most testing was conducted as white-box, unit testing during development. However, a final black-box, full application test was conducted at the end of development.

White-box & Black-box tested on Google Chrome: Version 72.0.3626.81 (Official Build) (64-bit)

Black-box tested on MS Edge: Version 25.10586.0.0 EdgeHTML version: 13.10586 

### Other Methods considered

A truly infinite game board would require a reference based approach rather than a grid approach. For example, neighbouring cells are referenced by a variable in a cell object.

This was attempted but abandoned due to the difficulty in looping back through all cells to update neighbour references. A grid approach removed this need and also allows the upper limits to be better controlled reducing performance or memory issues.
