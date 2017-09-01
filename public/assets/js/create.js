games = firebase.database().ref("/games");

$("#createGame").on("click", function()
{
    var player1 = firebase.auth().currentUser;
    var currentGame = {
        players: {
            "player1": {
                "uid": player1.uid,
                "displayName": player1.displayName,
                "id": 1
            }
        },
        state: 1,
        playerCount: 1
    }

    games.push().set(currentGame);
});

var openGames = games.orderByChild("state").equalTo(1);
openGames.on("child_added", function(game)
{
    var data = game.val();

    if(data.players.player1.uid == firebase.auth().currentUser.uid)
    {
        window.location.href = "game.html?g="+game.key;
    }

    $("#gameList").append("<div id='"+game.key+"' class='gameItem'><h3>Open Game</h3><p>Created by: "+data.players.player1.displayName+"</p><button class='gameJoin btn btn-lg btn-outline-dark' id="+game.key+">Join Game</button></div>")
    .on("click", ".gameItem", function(event){
        joinGame(event.target.id);
    });
})

openGames.on("child_removed", function(snapshot)
{
    var item = $("#" + snapshot.key);
    if(item)
    {
        item.remove();
    }
})

function joinGame(key) {
    var user = firebase.auth().currentUser;
    var playerCount, nextPlayer, nextPlayerID;

    games.child(key).once("value", function(game) {
        gameData = game.val();
        playerCount = gameData.playerCount+1;
        firebase.database().ref("/games/"+key)
        .update({
            "playerCount": playerCount
        })
    });

    var players = firebase.database().ref("/games/"+key+"/players/");
    players.once("child_added", function(player)
    {
        playerRef = firebase.database().ref("/games/"+key+"/playerCount");
        playerRef.once("value", function(number)
        {
            nextPlayerID = number.val();
        });

        nextPlayer = "player"+nextPlayerID.toString();
        firebase.database().ref("/games/"+key+"/players/"+nextPlayer)
        .update({
            "uid": user.uid,
            "displayName": user.displayName,
            "id": nextPlayerID
        });
    })
}
