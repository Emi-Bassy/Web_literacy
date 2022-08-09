let btn = document.querySelector("#gotoroom");

btn.addEventListener("click", function(){
    let room = document.querySelector("#roomname").value;
    window.location = `${window.location.origin}/room/${room}`;
});