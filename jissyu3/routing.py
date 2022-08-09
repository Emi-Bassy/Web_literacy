from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path("ws/matchingroom/<slug:room_name>/", consumers.MatchingConsumer.as_asgi()),
]