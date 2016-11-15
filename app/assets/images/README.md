# pentago

Pentago is a two-player strategy game, similar to Connect 4 but with a literal twist.

The game is played on a 6×6 board divided into four 3×3 sub-boards (or quadrants). Taking turns, the two players place a marble of their color (either black or white) onto an unoccupied space on the board, and then rotate one of the sub-boards by 90 degrees either clockwise or anti-clockwise.

A player wins by getting five of their marbles in a vertical, horizontal or diagonal row (either before or after the sub-board rotation in their move). If all 36 spaces on the board are occupied without a row of five being formed then the game is a draw. In addition, if both players get five in a row as a player turns a board, the game is also a draw.

Features of my game:
(1) Landing page with instructions
(2) Keeps track of wins, losses, and ties
(3) Global reset button to start a new game
(4) Visual aids including board rotation, token and, arrow hovering
(5) Mobile responsive

Key algorithms:
(1) Win condition - Searches neighbours of a particular cell a particular direction and counts the number of matches
(2) Board rotation - Reshuffles values according to direction of rotation

Areas for improvement:
(1) Code is messy due to missing out scenarios in the planning phase. Problems include multiple unnecessary(?) global variables, functions which do little (can be incorporated into other functions). Can be avoided with improved planning process.
(2) Inconsistent aesthetic due to design skill limitations.

To revisit:
(1) Clean up code
(2) Aesthetic theme of board
(3) Rotation - transpose out during rotation for added visual appeal
(4) Improve aesthetic of landing page

Shoutout to Jacq my styling consultant (:
