from time import time
from django.db import models
from django.utils import timezone

# Create your models here.
class WaitngUsers(models.Model):
    roomName = models.CharField(max_length=50, primary_key=True)
    userNum = models.IntegerField(default=1)
    createTime = models.DateTimeField(default=timezone.now())

class WaitingRooms(models.Model):
    roomName = models.CharField(max_length=50 ,primary_key=True)

class PlayingRooms(models.Model):
    roomName = models.CharField(max_length=50 ,primary_key=True)
    createTime = models.DateTimeField(default=timezone.now())
