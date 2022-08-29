from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("room/<str:room_name>", views.room, name="room"),
    path("roomadmin", views.roomadmin, name="roomadmin"),
    path("login", views.login, name="login"),
    path("game/<str:room_name>", views.game, name="game"),
    path("gameadmin/<str:room_name>", views.gameadmin, name="gameadmin")
]
