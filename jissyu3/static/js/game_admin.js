$(document).on("click", "#chat-btn", function(){
    chatSocket.send(JSON.stringify({"text": $("#chat-text").val(), "user": "admin"}));
    $("#chat-text").val("");
});

$(document).on("click", "#nextOk-btn", function(){
    if($(this).attr("data-now") == "chat"){
        $(".chat-side").css({"display": "none"});
        $(".confirm-side").css({"display": "block"});

        //分岐がある場合
        if("Branches" in nowJson[nowJson.length - 1]){
            const selector = nowJson[nowJson.length - 1].Branches.length;
            for(let i = 0; i < selector; i++){
                $(".admin-btns-wrapper").append(`<button id="next-chapter-ok" class="branches" data-branchNum="${i + 1}" title=${nowJson[nowJson.length - 1].Branches[i][0]["branch-content"]}><div class="btn-ok-no-inner"><p>${i + 1}</p></div></button>`)
            }
        }
        else{
            //章から章への遷移
            if("end" in nowJson[nowJson.length - 1]){
                $(".admin-btns-wrapper").append(`<button id="next-chapter-ok" class="branches" data-branchNum="${-1}"><div class="btn-ok-no-inner"><p>次へ</p></div></button>`)
            }

            //終了
            if("exit" in nowJson[nowJson.length - 1]){
                $(".admin-btns-wrapper").append(`<button id="next-chapter-ok" class="branches" data-branchNum="${-2}"><div class="btn-ok-no-inner"><p>終了</p></div></button>`)
            }
            
        }

        //エンディング等分岐がない場合
        

        $(this).attr("data-now", "confirm");
        $(this).find("p").text("×");
    }
    else{
        $(".confirm-side").css({"display": "none"});
        $(".admin-btns-wrapper").empty();
        $(".chat-side").css({"display": "block"});
        $(this).attr("data-now", "chat");
        $(this).find("p").text("!");
    }
});

$(document).on("click", ".branches", function(){
    const branchNum = Number($(this).attr("data-branchNum"));
    chatSocket.send(JSON.stringify({"nextOK": branchNum, "user": "admin"}));

    $(".confirm-side").css({"display": "none"});
    $(".admin-btns-wrapper").empty();
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