from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
from jissyu3.models import WaitngUsers

class MatchingConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

        n = 1

        try:
            theRoom = WaitngUsers.objects.get(roomName = self.room_name)
            theRoom.userNum += 1
            n = theRoom.userNum
            theRoom.save()
        except:
            NewRoom = WaitngUsers(roomName = self.room_name)
            NewRoom.save()
        
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            { 'type': 'sendMessage', 'message':  n}
        )
    
    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

        theRoom = WaitngUsers.objects.get(roomName = self.room_name)
        theRoom.userNum -= 1
        theRoom.save()

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            { 'type': 'sendMessage', 'message':  theRoom.userNum}
        )

    def receive(self, text_data):
        d = json.loads(text_data)
    
    def sendMessage(self, event):
        self.send(text_data=json.dumps({"res": event["message"]}))