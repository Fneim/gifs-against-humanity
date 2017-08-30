// Initialize Firebase
var config = {
    apiKey: "AIzaSyD-1LFYo4NSyds2OHi9SKet5G5J5uwgYL8",
    authDomain: "gifsah-5a445.firebaseapp.com",
    databaseURL: "https://gifsah-5a445.firebaseio.com",
    projectId: "gifsah-5a445",
    storageBucket: "gifsah-5a445.appspot.com",
    messagingSenderId: "46004164699"
};

firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function(user)
{
  if (user)
  {
      $.ajax({
          url: "/template/nav/navbar.html",
          success: function (data) { if($("nav").length) {$("nav").remove();}$("body").prepend(data);},
          dataType: 'html'
      }).done(function()
      {
          $("#auth").remove();
          $("nav").load("/template/nav/nav.html .base, .user");
      });
  }

  else
  {
      $.ajax({
          url: "/template/nav/navbar.html",
          success: function (data) {if($("nav").length) {$("nav").remove();}$("body").prepend(data);},
          dataType: 'html'
      }).done(function()
      {
          $("nav").load("/template/nav/nav.html .base, .nouser");
      });
  }
});
