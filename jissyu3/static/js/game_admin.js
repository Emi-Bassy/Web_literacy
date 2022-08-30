$(document).on("click", "#chat-btn", function(){
    chatSocket.send(JSON.stringify({"text": $("#chat-text").val(), "user": "admin"}));
    $("#chat-text").val("");
});

$(document).on("click", "#nextOk-btn", function(){
    chatSocket.send(JSON.stringify({"nextOK": true, "user": "admin"}));
});
