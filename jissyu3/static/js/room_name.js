let redirectRoomSocket;

$(window).on("load", function(){
    redirectRoomSocket = new WebSocket(
        `ws://${window.location.host}/ws/redirect/${$("#roomname span").text()}/`
    )

    redirectRoomSocket.onmessage = function(e){
        let data = JSON.parse(e.data).res
        if(data.type == "userRequest"){
            $("#start").prop("disabled", true);
            $("#start").html("<p>管理者を待っています</p>");
            $("#loading-icon").css({display: "inline-block"});
        }
        else if(data.type == "adminPermit"){
            window.location = `${window.location.origin}/game/${$("#roomname span").text()}`
        }
        else if(data.type == "adminReject"){
            $("#start").prop("disabled", false);
            $("#start").html("<p>開始</p>");
            $("#loading-icon").css({display: "none"});
        }
    }

    $.ajax({
        url: window.location.origin + "/api/v1/roomcheck",
        type: "POST",
        data: {"roomname": $("#roomname span").text()},
        dataType: "json",
        success: (data) => {
            if(data.now == "WAITING"){
                $("#start").prop("disabled", true);
                $("#start").html("<p>管理者を待っています</p>");
                $("#loading-icon").css({display: "inline-block"});
            }
        }
    })
});


$(document).on("click","#start",function(){
    $.ajax({
        url: window.location.origin + "/room/" + $("#roomname span").text(),
        type: "POST",
        data: {"roomname":$("#roomname span").text()},
        dataType: "json",
        success: function(data){
            redirectRoomSocket.send(JSON.stringify({"type": "userRequest"}))
        },
    })
})

