games = firebase.database().ref("/games");

/*
Game states:
1: Open Game
2: ALl players joined
3: Users select cards
4: Judge selects winner
5: Points, and reset
6: End Game
*/

//Watch Game for state updates
