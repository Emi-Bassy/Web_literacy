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

        /*ばっしーへ、上のwordがキャラ名、word_info[word]がキャラのセリフになってます。
        *セリフをログに追加するプログラムはこの辺に作った方がやりやすいかも？
        */

        if(word == "SYSTEM" && isNextChapterOk){
            $("#next-chapter").css({"display": "block"});
        }
        break;
    }

    //背景画像を変えろとの指示があった場合
    if("img" in word_info){
        $("#background-img").attr("src", word_info.img);
    }
}


$(window).on("load", function(){
    $.ajax({
        url: window.location.origin + "/static/words-test.json",
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
            const InsertHtml = `<li><img src="${data.user == "admin" ? "/static/picture/admin_icon.png" : "/static/picture/user_icon.png"}" width="20" height="20">
            <p>${data.text}</p>
            </li>`

            $(".chat").append(InsertHtml);
        }
    }
});

//次のセリフを表示するボタンをクリックしたとき
$(document).on("click", "#next-btn", function(){
    wordShow();
});

//次のチャプターへ進むボタンを押したとき
$(document).on("click", "#next-chapter", function(){
    $("#next-chapter").css({"display": "none"});

    wordsNum = -1;
    chapter++;
    isNextChapterOk = false;
    wordShow();
});
