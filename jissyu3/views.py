import re
from django.shortcuts import render, redirect

# Create your views here.
def index(request):
    return render(request, "index.html")

def room(request, room_name):
    return render(request, "room.html", {"room_name": room_name})

def roomadmin(request):
    if not "logined" in request.session:
        return redirect("login")
    return render(request, "roomadmin.html")

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