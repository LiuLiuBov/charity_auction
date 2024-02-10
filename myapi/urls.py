from django.urls import path
from .views import (BidCreateAPIView,
                    CategoryListCreateAPIView,
                    CategoryDetailAPIView)

urlpatterns = [
    path('auctions/<int:id>/bids/', BidCreateAPIView.as_view(), name='auction-bid-create'),
    path('categories/', CategoryListCreateAPIView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryDetailAPIView.as_view(), name='category-detail'),
]
