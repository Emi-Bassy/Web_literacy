from email import contentmanager
from multiprocessing import context
import re
from django.shortcuts import render, redirect
from jissyu3.models import WaitngUsers, WaitingRooms, PlayingRooms
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone

# Create your views here.
def index(request):
    #一定時間経ったゲーム部屋を消す
    playRoomAll = PlayingRooms.objects.all()
    for room in playRoomAll:
        if (timezone.now() - room.createTime).seconds >= 3600:
            room.delete()

    WaitUserRoomAll = WaitngUsers.objects.all()
    for userRoom in WaitUserRoomAll:
        if (timezone.now() - userRoom.createTime).seconds >= 3600:
            userRoom.delete()

    return render(request, "index.html")

@csrf_exempt
def room(request, room_name):
    if request.method == "POST":
        roomName = request.POST["roomname"]
        try:
            result = WaitingRooms(roomName = roomName)
            result.save()
        except:
            pass
        return JsonResponse({"res": "SUCCESS"})

    return render(request, "room.html", {"room_name": room_name})

@csrf_exempt
def roomcheck(request):
    if request.method == "POST":
        roomName = request.POST["roomname"]
        try:
            WaitingRooms.objects.get(roomName = roomName)
            return JsonResponse({"now": "WAITING"})

        except:
            return JsonResponse({"now": "NOT_WAITING"})

    else:
        return JsonResponse({"res": "ERROR"})

def roomname(request):
    if request.method == "POST":
        roomname_data = request.POST["roomname"]
        content = WaitingRooms.objects.filter(roomname__startwith = roomname_data)
        l = []
        for a in content:
            if not a.user in l:
                l.append(a.user)

        data = {"roomname": l}
        return JsonResponse(data)
        
    else:
        return HttpResponse("ERROR")

def roomadmin(request):
    if not "logined" in request.session:
        return redirect("login")

    data = {}
    WaitingRooms_result = WaitingRooms.objects.all()
    data["WaitingRooms_result"] = WaitingRooms_result
    return render(request, "roomadmin.html", data)
"""
    try:
        rooms = WaitingRooms.objects.all()
    except WaitingRooms.DoesNotExist:
        raise Http404("WaitingRooms does not exist")
    context = { 'rooms' : WaitingRooms }
    return render(request, "roomadmin.html", context)
"""   

def login(request):
    if request.method == "POST":
        if request.POST["password"] == "Jissyu3Practic5":
            request.session["logined"] = True
            return redirect("roomadmin")
        return render(request, "login.html")
    else:
        if not "logined" in request.session:
            return render(request, "login.html")
        else:
            return redirect("roomadmin")  

def logout(request):
    if "logined" in request.session:
        request.session.pop("logined")
    
    return redirect("index")

def game(request, room_name):
    try:
        PlayingRooms.objects.get(roomName = room_name)
    except:
        return redirect("index")
    return render(request, "game.html", {"room_name": room_name})

def gameadmin(request, room_name):
    try:
        PlayingRooms.objects.get(roomName = room_name)
    except:
        return redirect("index")

    if not "logined" in request.session:
        return redirect("index")

    return render(request, "game.html", {"room_name": room_name, "isAdmin": True})