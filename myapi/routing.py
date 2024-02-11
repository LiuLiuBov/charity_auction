from django.urls import path
from .consumers import BidConsumer, CommentConsumer

websocket_urlpatterns = [
    path('ws/auctions/<int:id>/bids/', BidConsumer.as_asgi()),
    path('ws/auctions/<int:id>/comments/', CommentConsumer.as_asgi()),
]
