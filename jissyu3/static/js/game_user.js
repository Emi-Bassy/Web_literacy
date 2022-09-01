$(document).on("click", "#chat-btn", function(){
    chatSocket.send(JSON.stringify({"text": $("#chat-text").val(), "user": "user"}));
    $("#chat-text").val("");
});

//次のチャプターへ進むボタンを押したとき
$(document).on("click", "#next-chapter", function(){
    $("#next-chapter").css({"display": "none"});
    $("#next-btn").prop("disabled", false);

    wordsNum = -1;
    chapter++;
    isNextChapterOk = false;

    if(!jsonWord[chapter]){
        window.location = window.location.origin;
    }

    wordShow();
});

$(document).on("click", "#exit-btn", function(){
    const answer = confirm("退出しますか？");
    if(answer){
        window.location = window.location.origin;
    }
});