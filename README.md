# TEA CUPPER
This is a basic game similar to the popular 80s arcade game ["Frogger"](https://en.wikipedia.org/wiki/Frogger).
The aim of the game is to bring your teacup to the teapot across the table without crashing into any of the sweets, within the allocated times (30 seconds). The player has 5 lives.

## BUILT WITH
It's a browser rendered game built with:
- HTML
- CSS
- JAVASCRIPT
- CANVAS API (for the game itself)

## HOW THE GAME WORKS
The game is structured as a grid, where obstacles and player move.
There are 2 "safe" rows (start and end) where there are no obstacles.

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

Every 7 seconds the speed of the obstacles randomly increase by 3 times or decreased by 0.5 times, for 2 secs and then reverts to standard.

If the player crashes in an obstacles, it's reset to starting position, until the lives runs out.

