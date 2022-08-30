from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path("ws/matchingroom/<slug:room_name>/", consumers.MatchingConsumer.as_asgi()),
    path("ws/redirect/<slug:room_name>/", consumers.RedirectConsumer.as_asgi()),
    path("ws/chat/<slug:room_name>/", consumers.ChatConsumer.as_asgi()),
]