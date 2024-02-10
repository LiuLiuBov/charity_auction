from django.urls import path
from .consumers import BidConsumer

websocket_urlpatterns = [
    path('ws/auctions/<int:id>/bids/', BidConsumer.as_asgi()),
]
