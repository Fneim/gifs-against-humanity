games = firebase.database().ref("/games");

//When a user clicks the button to create a game
$("#createGame").on("click", function()
{
    //Get the current user
    var player1 = firebase.auth().currentUser;
    //Setup the game object with the current user as player1
    var currentGame = {
        players: {
            "player1": {
                "uid": player1.uid,
                "displayName": player1.displayName,
                "id": 1
            }
        },
        state: 1, //Set the game state to open
        playerCount: 1
    }

    //Push the new game object to the games list
    games.push().set(currentGame);
});

//Display games with open state (1) in realtime on the page
var openGames = games.orderByChild("state").equalTo(1);
openGames.on("child_added", function(game)
{
    var data = game.val();

    //If the game added was created by the current user
    if(data.players.player1.uid == firebase.auth().currentUser.uid)
    {
        //Move that user into that game's lobby
        window.location.href = "game.html?g="+game.key;
    }

    //Append the game to the page with join button
    $("#gameList").append("<div id='"+game.key+"' class='gameItem'><h3>Open Game</h3><p>Created by: "+data.players.player1.displayName+"</p><p>Players Waiting: "+data.playerCount+"/4</p><button class='gameJoin btn btn-lg btn-outline-dark' id="+game.key+">Join Game</button></div>")
    .on("click", ".gameItem", function(event){
        joinGame(event.target.id);
    });
})

//If a game is removed, remove the item from the page
openGames.on("child_removed", function(snapshot)
{
    var item = $("#" + snapshot.key);
    if(item)
    {
        item.remove();
    }
})

//When a user clicks the butotn to join a game
function joinGame(key) {
    //Get the current user and initialize variables
    var user = firebase.auth().currentUser;
    var playerCount, nextPlayer, nextPlayerID;
    var players = firebase.database().ref("/games/"+key+"/players/");
    var playerRef = firebase.database().ref("/games/"+key+"/playerCount");

    //Get the current player count
    playerRef.once("value", function(number)
    {
        currentCount = number.val();
        //If there are not yet 4 players
        if(currentCount < 4)
        {
            //Update the player count by 1
            games.child(key).once("value", function(game) {
                gameData = game.val();
                playerCount = gameData.playerCount+1;
                firebase.database().ref("/games/"+key)
                .update({
                    "playerCount": playerCount
                })
            });
            nextPlayerID = playerCount;
        }
        //Otherwise change the game state to closed (2)
        //TODO: Delete closed games from the game list in realtime (instead of on join click)
        else(
            games.child(key).once("value", function(game) {
                gameData = game.val();
                firebase.database().ref("/games/"+key)
                .update({
                    "state": 2
                })
            });
        )
    });

    //If a new player is added in the game
    players.once("child_added", function(player)
    {
        //Push the player data to the database
        nextPlayer = "player"+nextPlayerID.toString();
        firebase.database().ref("/games/"+key+"/players/"+nextPlayer)
        .update({
            "uid": user.uid,
            "displayName": user.displayName,
            "id": nextPlayerID
        });
        //Redirect the player to the game lobby.
        //TODO: Test if this interfers with other players joining other games.
        window.location.href = "game.html?g="+key;
    })
}
