let jsonWord;

//現在何章か
let chapter = 1;

//現在何番目のセリフか
let wordsNum = -1;

//次の章へ進んでよいか
let isNextChapterOk = false;

//webSocket用
let chatSocket;


//現在表示することができるJSON
let nowJson;

//次のセリフを表示させるための関数
function wordShow(thisJson){
    wordsNum++;
    //一番最初のセリフを表示
    let word_info = jsonWord[chapter][wordsNum];

    $("#chapterNum").text(`${chapter}章`);

    let showWordInfo = thisJson[wordsNum];

    for(let word in showWordInfo){
        //一番最初に出てくるのがセリフになるはず
        $(".character-name").text(word);
        $(".words").text(showWordInfo[word]);

        $(".chat-log").append(`<li><span class="chara-log">${word}:</span><span class="words-log">${showWordInfo[word]}</span></li>`)

        const chatLog = document.querySelector(".chat-log");
        chatLog.scrollTo(0, chatLog.scrollHeight);

        // if(word == "SYSTEM" && isNextChapterOk){
        //     $("#next-chapter").css({"display": "block"});
        // }

        if(word == "SYSTEM"){
            $("#next-btn").prop("disabled", true);
            $("#next-show").css({visibility: "hidden"});
        }


        
        break;
    }

    //背景画像を変えろとの指示があった場合
    if("img" in showWordInfo){
        $("#background-img").attr("src",  showWordInfo.img);
    }

    if("characters" in showWordInfo){
        const characters =  showWordInfo.characters;
        let insertCharacterHTML = "";

        for(let i = 0; i < characters.length; i++){
            insertCharacterHTML += `<img src="${characters[i]}" data-cnt=${i} class="one-character">`
        }

        $(".character-img-wrapper").html(insertCharacterHTML);
        
        if("focus" in showWordInfo){
            $(`.character-img-wrapper .one-character:nth-child(${ showWordInfo.focus + 1})`).css({
                transform: "translateY(-40px)"
            })

            $(".character-img-wrapper .one-character").each((i, n) => {
                if(i != showWordInfo.focus){
                    $(n).css({
                        filter: "brightness(30%)"
                    })
                }
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
            nowJson = jsonWord[1];
            wordShow(jsonWord[1]);
        }
    })

    //チャットへの接続
    chatSocket = new WebSocket(
        `${window.location.protocol == "https:" ? "wss" : "ws"}://${window.location.host}/ws/chat/${$("#roomName").text()}/`
    );
    
    chatSocket.onmessage = function(e){
        const data = JSON.parse(e.data).res;
        if("nextOK" in data){
            console.log(data.nextOK);
            //-2はゲーム終了フラグ(とんでもないスパゲッティコードだよ！楽しいね！)
            if(data.nextOK == -2){
                window.location = window.location.origin;
            }

            //-1は次の章へ切り替えるフラグ
            else if(data.nextOK == -1){
                chapter++;

                const branches = wordsNum;
                
                if(branches != nowJson.length - 2){
                    for(let i = 0; i < (nowJson.length - 2) - branches; i++){
                        $("#next-btn").click();
                    }
                }
                wordsNum = -1;
                nowJson = jsonWord[chapter];
                wordShow(nowJson);
                $("#next-btn").prop("disabled", false);
                $("#next-show").css({visibility: "visible"});
            }

            //それ以外は次のブランチに切り替えるフラグ(番号がブランチの番号に対応している)
            else{
                const branches = wordsNum;
                // nowJson = jsonWord[chapter][branches + 1]["Branches"][data.nextOK - 1]
                if(branches != nowJson.length - 2){
                    for(let i = 0; i < (nowJson.length - 2) - branches; i++){
                        $("#next-btn").click();
                    }
                }
                wordsNum = -1;

                nowJson = nowJson[nowJson.length - 1]["Branches"][data.nextOK - 1];
                wordShow(nowJson);
                $("#next-btn").prop("disabled", false);
                $("#next-show").css({visibility: "visible"});
            }
        }
        //通常のチャット
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
    wordShow(nowJson);
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