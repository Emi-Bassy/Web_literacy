$(window).on("load", function(){
   //このルームの番号を取得
    let theroom = document.querySelector("#roomname span").textContent;

    let matchingRoomSocket = new WebSocket(
        `ws://${window.location.host}/ws/matchingroom/${theroom}/`
    );

    matchingRoomSocket.onmessage = function(e){
        let data = JSON.parse(e.data);
        let userNum = data["res"]
        let userNumhtml = document.querySelector("#userNum")
        userNumhtml.textContent = userNum
    }
});