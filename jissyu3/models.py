from django.db import models

# Create your models here.
class WaitngUsers(models.Model):
    roomName = models.CharField(max_length=50, primary_key=True)
    userNum = models.IntegerField(default=1)