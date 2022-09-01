let redirectRoomSocket;

$(window).on("load", function(){
    redirectRoomSocket = new WebSocket(
        `ws://${window.location.host}/ws/redirect/${$("#roomname span").text()}/`
    )

    redirectRoomSocket.onmessage = function(e){
        let data = JSON.parse(e.data).res
        if(data.type == "userRequest"){
            $("#start").prop("disabled", true);
            $("#start").text("管理者を待っています")
        }
        else if(data.type == "adminPermit"){
            window.location = `${window.location.origin}/game/${$("#roomname span").text()}`
        }
    }
});


$(document).on("click","#start",function(){
    $.ajax({
        url: window.location.origin + "/room/" + $("#roomname span").text(),
        type: "POST",
        data: {"roomname":$("#roomname span").text()},
        dataType: "json",
        success: function(data){
            console.log("aaa");
            redirectRoomSocket.send(JSON.stringify({"type": "userRequest"}))
        },
    })
})

