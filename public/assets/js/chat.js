firebase.auth().onAuthStateChanged(function(user)
{
    if (user)
    {
      initChat(user);
    }
});

function initChat(user)
{
   var chatRef = firebase.database().ref("chat");
   var chat = new FirechatUI(chatRef, document.getElementById("firechat-wrapper"));
   chat.setUser(user.uid, user.displayName);
}
