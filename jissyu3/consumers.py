from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
from jissyu3.models import WaitingRooms, WaitngUsers
from jissyu3.views import roomname

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


#管理者のリダイレクト設定と、ユーザがルーム申請したのを他のユーザと共有するやつ
class RedirectConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name + "2"
        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()
    
    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        if data["type"] == "adminPermit":
            theRoom = WaitingRooms.objects.get(roomName = data["roomName"])
            theRoom.delete()

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            { 'type': 'sendMessage', 'message':  data}
        )
    
    def sendMessage(self, event):
        self.send(text_data=json.dumps({"res": event["message"]}))

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name + "3"
        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()
    
    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
    
    def receive(self, text_data):
        data = json.loads(text_data)
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            { 'type': 'sendMessage', 'message':  data}
        )
    
    def sendMessage(self, event):
        self.send(text_data=json.dumps({"res": event["message"]}))