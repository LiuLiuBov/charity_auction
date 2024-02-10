from django.urls import path
from .views import BidCreateAPIView

urlpatterns = [
    path('auctions/<int:id>/bids/', BidCreateAPIView.as_view(), name='auction-bid-create'),
]