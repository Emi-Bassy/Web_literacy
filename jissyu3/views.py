from email import contentmanager
from multiprocessing import context
import re
from django.shortcuts import render, redirect
from jissyu3.models import WaitingRooms
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
def index(request):
    return render(request, "index.html")

@csrf_exempt
def room(request, room_name):
    if request.method == "POST":
        roomName = request.POST["roomname"]
        result = WaitingRooms(roomName = roomName)
        result.save()

    return render(request, "room.html", {"room_name": room_name})


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
        if request.POST["password"] == "password":
            request.session["logined"] = True
            return redirect("roomadmin")
    else:
        if not "logined" in request.session:
            return render(request, "login.html")
        else:
            return redirect("roomadmin")                      