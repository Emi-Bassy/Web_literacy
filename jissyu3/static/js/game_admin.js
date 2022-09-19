$(document).on("click", "#chat-btn", function(){
    chatSocket.send(JSON.stringify({"text": $("#chat-text").val(), "user": "admin"}));
    $("#chat-text").val("");
});

$(document).on("click", "#nextOk-btn", function(){
    if($(this).attr("data-now") == "chat"){
        $(".chat-side").css({"display": "none"});
        $(".confirm-side").css({"display": "block"});
        $(this).attr("data-now", "confirm");
        $(this).find("p").text("×");
    }
    else{
        $(".confirm-side").css({"display": "none"});
        $(".chat-side").css({"display": "block"});
        $(this).attr("data-now", "chat");
        $(this).find("p").text("!");
    }
});

$(document).on("click", "#next-chapter-ok", function(){
    chatSocket.send(JSON.stringify({"nextOK": true, "user": "admin"}));

    $(".confirm-side").css({"display": "none"});
    $(".chat-side").css({"display": "block"});
    $("#nextOk-btn").attr("data-now", "chat");
    $("#nextOk-btn").find("p").text("!");
});

$(document).on("click", "#next-chapter-no", function(){
    $(".confirm-side").css({"display": "none"});
    $(".chat-side").css({"display": "block"});
    $("#nextOk-btn").attr("data-now", "chat");
    $("#nextOk-btn").find("p").text("!");
});

//次のチャプターへ進むボタンを押したとき
$(document).on("click", "#next-chapter", function(){
    $("#next-chapter").css({"display": "none"});
    $("#next-btn").prop("disabled", false);

    wordsNum = -1;
    chapter++;
    isNextChapterOk = false;

    if(!jsonWord[chapter]){
        window.location = window.location.origin + "/roomadmin";
    }

    wordShow();
});

$(document).on("click", "#exit-btn", function(){
    const answer = confirm("退出しますか？");
    if(answer){
        window.location = window.location.origin + "/roomadmin";
    }
});