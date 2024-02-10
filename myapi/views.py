from django.shortcuts import render
from rest_framework import generics, serializers, status, permissions
from rest_framework.exceptions import PermissionDenied
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .serializers import *


class DefaultPermissionsMixin():
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        else:
            return [permissions.IsAuthenticated(), permissions.IsAdminUser()]


class CategoryListCreateAPIView(DefaultPermissionsMixin, generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryDetailAPIView(DefaultPermissionsMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class BidCreateAPIView(generics.CreateAPIView):
    queryset = Bid.objects.all()
    serializer_class = BidSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        auction_id = self.kwargs.get('id')
        auction = generics.get_object_or_404(AuctionListing, id=auction_id)

        if self.request.user == auction.owner:
            raise PermissionDenied('Auction owners cannot bid on their own auctions.')

        if auction.current_bid and serializer.validated_data['amount'] <= auction.current_bid:
            raise serializers.ValidationError('Your bid must be higher than the current bid.')
        elif serializer.validated_data['amount'] <= auction.starting_bid:
            raise serializers.ValidationError('Your bid must be at least equal to the starting bid.')

        serializer.save(bidder=self.request.user, auction_listing=auction)

        auction.current_bid = serializer.validated_data['amount']
        auction.save()

        self._trigger_bid_broacast(auction_id)

    def _trigger_bid_broacast(self, auction_id):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'auction_{auction_id}',  # Use the actual auction ID
            {
                'type': 'broadcast_bid',
                'message': {'info': 'New bid placed'}
            }
        )


class AuctionListingListCreateAPIView(DefaultPermissionsMixin, generics.ListCreateAPIView):
    queryset = AuctionListing.objects.all()
    serializer_class = AuctionListingSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class AuctionListingDetailAPIView(DefaultPermissionsMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = AuctionListing.objects.all()
    serializer_class = AuctionListingSerializer
