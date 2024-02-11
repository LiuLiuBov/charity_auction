from django.urls import path
from .views import (BidCreateAPIView,
                    CategoryListCreateAPIView,
                    CategoryDetailAPIView,
                    AuctionListingListCreateAPIView,
                    AuctionListingDetailAPIView, CreateUserView, CreateTokenView,
                    )

urlpatterns = [
    path('signup/', CreateUserView.as_view(), name='signup'),
    path('signin/', CreateTokenView.as_view(), name='signin'),
    path('auctions/<int:id>/bids/', BidCreateAPIView.as_view(), name='auction-bid-create'),
    path('categories/', CategoryListCreateAPIView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryDetailAPIView.as_view(), name='category-detail'),
    path('auctions/', AuctionListingListCreateAPIView.as_view(), name='auction-listing-list-create'),
    path('auctions/<int:pk>/', AuctionListingDetailAPIView.as_view(), name='auction-listing-detail'),
]
