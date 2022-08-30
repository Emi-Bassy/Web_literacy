$(document).on("click", "#chat-btn", function(){
    chatSocket.send(JSON.stringify({"text": $("#chat-text").val(), "user": "user"}));
    $("#chat-text").val("");
});
