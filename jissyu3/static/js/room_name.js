$(document).on("click","#start",function(){
    $.ajax({
        url: window.location.origin + "/room/" + $("#roomname span").text(),
        type: "POST",
        data: {"roomname":$("#roomname span").text()},
        dataType: "json",
    })
})

