games = firebase.database().ref("/games");

/*
Game states:
1: Open Game
2: Active Game (2 joined players)
3: Completed Game (game finished)
*/

//Create a new game function
$("#createGame").on("click", function()
{
    var host = firebase.auth().currentUser;
    var currentGame = {
        host: {uid: host.uid, displayName: host.displayName},
        state: 1 //Open
    }

    games.push().set(currentGame);
});

//List open games in realtime.
var openGames = games.orderByChild("state").equalTo(1);
openGames.on("child_added", function(game)
{
    var data = game.val();
    //Do not display games created by that user.
    if(data.host.uid != firebase.auth().currentUser.uid)
    {
        $("#gameList").append("<div id='"+game.key+"' class='gameItem'><h3>Open Game</h3><p>Created by: "+data.host.displayName+"</p><button class='gameJoin btn btn-lg btn-outline-dark' id="+game.key+">Join Game</button></div>")
        .on("click", ".gameItem", function(event){
            joinGame(event.target.id);
        });
    }
})

//Remove open games in realtime.
openGames.on("child_removed", function(snapshot)
{
    var item = $("#" + snapshot.key);
    if(item)
    {
        item.remove();
    }
})

//Join games
function joinGame(key) {
    console.log("Attempting to join game: ", key);
    var user = firebase.auth().currentUser;
    games.child(key).transaction(function(game) {
        //only join if someone else hasn't
        if (!game.joiner) {
            game.state = 2;
            game.joiner = {
                uid: user.uid,
                displayName: user.displayName
            }
        }
        return game;
    }, function(error, committed, snapshot) {
        if (committed) {
            if (snapshot.val().joiner.uid == user.uid) {
                watchGame(key);
            } else {
                console.log("Game already joined");
            }
        } else {
            console.log("Could not commit when trying to join game", error);        }
    });
}

//Watch Game for state updates
function watchGame(key) {
    var gameRef = games.child(key);
    gameRef.on("value", function(snapshot) {
        var game = snapshot.val();
        console.log("Game update:", game);

        if (!game) {
            console.log("Game Over!!!");
            // enableCreateGame(true);
            return
        }

        switch (game.state) {
            case 2:
                console.log("calling joined game");
                joinedGame(game, gameRef);
                break;
            case 3:
                console.log("Ay boi pick a move");
                //Host turn
                break;
            case 4:
                //Joiner Turn
                break;
            case 5:
                //Determine Winner, Next round
                break;
            case 6:
                //All rounds over, display winner.
                break;
        }
    })
}

//When a user has joined a game
function joinedGame(game, gameRef) {
    if (game.host.uid == firebase.auth().currentUser.uid) {
        console.log("User "+game.joiner.displayName+" has joined your game!")
        //wait a little bit
        window.setTimeout(function() {
            //Set state to Host's turn
            gameRef.update({state: 3});
        }, 1000);
    }
}
