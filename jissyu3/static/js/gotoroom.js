let btn = document.querySelector("#gotoroom");

btn.addEventListener("click", function(){
    let room = document.querySelector("#roomname").value;
    const ROOM_PATTERN = /^([a-z]+|[A-Z]+|\d+)+$/;

    if(!ROOM_PATTERN.test(room)){
        alert("適切な名前を入力してください");
        document.querySelector("#roomname").value = "";
        return;
    }

    window.location = `${window.location.origin}/room/${room}`;
});

let roomInput = document.querySelector("#roomname");

roomInput.addEventListener("keyup", (e) =>{
    if(e.which == 13){
        btn.click();
    }
})