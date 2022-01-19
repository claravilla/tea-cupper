# TEA CUPPER
This is a basic game similar to the popular 80s arcade game ["Frogger"](https://en.wikipedia.org/wiki/Frogger).
The aim of the game is to bring your teacup to the teapot across the table without crashing into any of the sweets, within the allocated times (30 seconds). The player has 5 lives.

## BUILT WITH
It's a browser rendered game built with:
- HTML
- CSS
- JAVASCRIPT
- CANVAS API (for the game itself)

## GAME RULES
The plaver needs to cross the table and reach the teapot without crashing in any obstacles.
Player can move up down left right.
There are 2 "safe" rows (start and end) where there are no obstacles.
If the player crashes in an obstacle, it's reset to starting position, until the lives run out.
If the player reaches the teapot, it wins.
If the player runs out of lives, it loses.
If the time elapsed and the player hasn't reached the teapoit, it loses.

## HOW THE GAME WORKS
The game is structured as a grid, where obstacles and player move.

### GAME OBJECT
The game updates every 20milliseconds and check if the player has crashed or won (and redraw the board).
The game has a "frame" variable that is increased by 1 everytime the game updates (so every 20milliseconds) that is used to draw new obstacles in the game.

### OBSTACLES

The obstacles are placed in 4 rows with the following config:
- cupcakes:
    - speed: slow
    - size: one cell
    - position: alternating on the X axis and randomly placed on row 1 or 3 on the Y axis
- cookies Jars:
    - speed: medium
    - size: two cell
    - position: alternating on the X axis, row 2 on the Y axis
- cookies Jars:
    - speed: fast
    - size: two cell
    - position: alternating on the X axis, row 4 on the Y axis

Obstacles are created added to an array that is used to check for crash and to draw them on the board with every refresh.
At start, a function draw enough obstacles to fill the grid.
New obstacles are drawn every fixed number of frames, depending on their size and speed.

### CRASH
A function checks if the position of the player overlaps with any of the obstacles.
If so, lives are decreased and player is reset to initial position.
When lives reach 0, the game over function is called.

### WIN
A function checks if the player position is in the Teapot area.

### GAME OVER
The function stops the game. It's called when either the time or lives reach 0.

### CHANGE OF SPEED
There is a game speed variable set to 1, and each obstacle's speed is a multiplier of it.
Every 7 seconds the game speed is randomly changed to 0.5 or 3, making the obstacles' speed increase or decrease. This lasts for 2 sec and then the game speed is reset to 1.






