$.ajax({
    url: "/template/head.html",
    success: function (data)
    {
         $('head').prepend(data);
         $("#loading").remove();
     },
     dataType: 'html'
})

$.initialize(".nouser", function()
{
    $(this).on("click", "#siBtn", function()
    {
        $.ajax({
            url: "/template/user/signin.html",
            success: function (data)
            {
                if($("#auth").length){$("#auth").remove();}
                $('nav').after("<div id='auth'></div>");
                $('#auth').html(data);
             },
             dataType: 'html'
        }).done(function()
        {
            $("#siSubmit").on("click", function(event)
            {
                event.preventDefault();
                var email = $("#siUserEmail").val();
                var password = $("#siUserPassword").val();

                firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){})
                .catch(function(error)
                {
                    $("nav").append("<div class='alert alert-danger' role='alert'>"+error.message+"</div>");
                });
            })
        });
    })
});

$.initialize(".nouser", function()
{
    $(this).on("click", "#suBtn", function()
    {
        $.ajax({
            url: "/template/user/signup.html",
            success: function (data)
            {
                if($("#auth").length){$("#auth").remove();}
                $('nav').after("<div id='auth'></div>");
                $('#auth').html(data);
             },
             dataType: 'html'
        }).done(function()
        {
            $("#suSubmit").on("click", function(event)
            {
                event.preventDefault();
                var name = $("#suDisplayName").val();
                var email = $("#suUserEmail").val();
                var password = $("#suUserPassword").val();

                firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user){
                    firebase.auth().currentUser.updateProfile({displayName: name});
                });
            })
        });
    })
});

$.initialize(".user", function()
{
    var displayName = firebase.auth().currentUser.displayName;
    $("#displayName").text(displayName);

    $(this).on("click", "#soBtn", function()
    {
        event.preventDefault();
        firebase.auth().signOut().then(function(){})
        .catch(function(error)
        {
            // An error happened.
        });
    })
})
