$(document).on("click", ".permit", function(){
  let isOk = confirm("この部屋を選択します。よろしいですか？");
  if(isOk){
    let roomName = $(this).attr("data-roomName");

    let redirectRoomSocket = new WebSocket(
      `ws://${window.location.host}/ws/redirect/${roomName}/`
    )

    redirectRoomSocket.onopen = function(){
      redirectRoomSocket.send(JSON.stringify({"type": "adminPermit", "roomName": roomName}))
      window.location = `${window.location.origin}/gameadmin/${roomName}`
    }
  }
});