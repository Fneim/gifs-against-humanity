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

//Get game key from URL parameter
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var key = getUrlParameter('g');

//Watch Game for state updates
games.child(key).on("value", function(game) {
    gameData = game.val();
    if(gameData.playerCount == 4)
    {
        console.log("There are 4 players!!!");
        //Set the state to closed to prevent new players from joining
        firebase.database().ref("/games/"+key)
        .update({
            "state": 2
        })
        //Create the 1st round
        createRound();
    }
});

//Listen for players being added
var players = firebase.database().ref("/games/"+key+"/players/");
players.on("child_added", function(data)
{
    var player = data.val();
    $("#playerList").append("<p>Player "+player.displayName+" has joined the game!");
})

function createRound()
{
    //Round Created!!!
}
