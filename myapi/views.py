from django.shortcuts import render
from rest_framework import generics, serializers, status, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .serializers import *


class CategoryListCreateAPIView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class CategoryDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class BidCreateAPIView(generics.CreateAPIView):
    queryset = Bid.objects.all()
    serializer_class = BidSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        auction_id = self.kwargs.get('id')
        auction = generics.get_object_or_404(AuctionListing, id=auction_id)

        # Check if the user is the auction owner
        if self.request.user == auction.owner:
            raise PermissionDenied('Auction owners cannot bid on their own auctions.')

        # Validate bid amount
        if auction.current_bid and serializer.validated_data['amount'] <= auction.current_bid:
            raise serializers.ValidationError('Your bid must be higher than the current bid.')
        elif serializer.validated_data['amount'] <= auction.starting_bid:
            raise serializers.ValidationError('Your bid must be at least equal to the starting bid.')

        serializer.save(bidder=self.request.user, auction_listing=auction)

        # Update current bid in the AuctionListing
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
