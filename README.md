# superstore

Guess the name of your favorite Alternative Bands in this hangman style game!

**Gameplay Preview**

![](word_guess.gif)

**Game win Preview**

![](word_guess_win.gif)

**Game lose Preview**

![](word_guess_lose.gif)

**This is a node.js CLI word guessing game built using JS object constructors**

**The game begins with a random word selected from the word bank.**

    * The word is diplayed as blank underscores representing each letter
            
**Gameplay begins by prompting the player to enter a letter**

    * If the player guesses right, the letter is revealed
    * If guess is wrong, number of guesses remaining will be reduced by 1
    * Player can only guess one letter at a time. If more than one character is entered, the player loses a guess

**When the word is guessed**

    * Player goes up a level and is prompted to continue playing

**When player runs out of guesses(0)**

    * The game is over
    * Player is asked to start game again 

**Technologies Used**

    * node.js
    * npm
    * cfonts
    * inquirer
    * constructors
    * recursion