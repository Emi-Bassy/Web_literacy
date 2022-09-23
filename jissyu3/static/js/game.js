let jsonWord;

//現在何章か
let chapter = 1;

//現在何番目のセリフか
let wordsNum = -1;

//次の章へ進んでよいか
let isNextChapterOk = false;

//webSocket用
let chatSocket;

//次のセリフを表示させるための関数
function wordShow(){
    wordsNum++;
    //一番最初のセリフを表示
    let word_info = jsonWord[chapter][wordsNum];

    $("#chapterNum").text(`${chapter}章`);

    for(let word in word_info){
        //一番最初に出てくるのがセリフになるはず
        $(".character-name").text(word);
        $(".words").text(word_info[word]);

        /*ばっしーへ、上のwordが現在のキャラ名、word_info[word]がそのキャラのセリフになってます。
        *セリフをログに追加するプログラムはこの辺に作った方がやりやすいかも？
        */

        $(".chat-log").append(`<li><span class="chara-log">${word}:</span><span class="words-log">${word_info[word]}</span></li>`)

        const chatLog = document.querySelector(".chat-log");
        chatLog.scrollTo(0, chatLog.scrollHeight);

        if(word == "SYSTEM" && isNextChapterOk){
            $("#next-chapter").css({"display": "block"});
        }

        if(word == "SYSTEM"){
            $("#next-btn").prop("disabled", true);
        }
        
        break;
    }

    //背景画像を変えろとの指示があった場合
    if("img" in word_info){
        $("#background-img").attr("src", word_info.img);
    }

    if("characters" in word_info){
        const characters = word_info.characters;
        let insertCharacterHTML = "";

        for(let i = 0; i < characters.length; i++){
            insertCharacterHTML += `<img src="${characters[i]}" data-cnt=${i} class="one-character">`
        }

        $(".character-img-wrapper").html(insertCharacterHTML);
        
        if("focus" in word_info){
            $(`.character-img-wrapper .one-character:nth-child(${word_info.focus + 1})`).css({
                transform: "translateY(-40px)",
                filter: "contrast(0.2)",
            })
        }
    }
    else{
        $(".character-img-wrapper").html("");
    }
}


$(window).on("load", function(){
    $.ajax({
        url: window.location.origin + "/static/words.json",
        type: "GET",
        dataType: "json",
        success: function(data){
            jsonWord = data;
            wordShow();
        }
    })

    //チャットへの接続
    chatSocket = new WebSocket(
        `ws://${window.location.host}/ws/chat/${$("#roomName").text()}/`
    );
    
    chatSocket.onmessage = function(e){
        const data = JSON.parse(e.data).res;
        if("nextOK" in data){
            isNextChapterOk = true;

            if($(".character-name").text() == "SYSTEM"){
                $("#next-chapter").css({"display": "block"});
            }
        }
        else{
            const InsertHtml = `<li><img src="${data.user == "admin" ? "/static/picture/admin_icon.png" : "/static/picture/user_icon.png"}" width="40" height="40">
            <p>${data.text}</p>
            </li>`

            $(".chat").append(InsertHtml);

            const chat = document.getElementsByClassName("chat")[0];
            chat.scrollTo(0, chat.scrollHeight);
        }
    }
});

//次のセリフを表示するボタンをクリックしたとき
$(document).on("click", "#next-btn", function(){
    wordShow();
});


$(document).on("click", ".arrow-btn", function(){
    $(this).parent().toggleClass("active");
});

$(document).on("click", "#log-btn", function(){
    $(".log").css({visibility: "visible"});
});

$(document).on("click", ".log", function(){
    $(".log").css({visibility: "hidden"});
});

$("#chat-text").keyup(function(e){
    if(e.which == 13){
        $("#chat-btn").click();
    }
});