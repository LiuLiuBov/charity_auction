from django.db import transaction
from django.shortcuts import render
from rest_framework import generics, serializers, status, permissions
from rest_framework.exceptions import PermissionDenied
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .serializers import *


class SignUpView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, format=None):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SignInView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, format=None):
        serializer = SignInSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
            f'auction_{auction_id}',
            {
                'type': 'broadcast_bid',
                'message': {'info': 'New bid placed'}
            }
        )


class AuctionListingListCreateAPIView(DefaultPermissionsMixin, generics.ListCreateAPIView):
    queryset = AuctionListing.objects.all()
    serializer_class = AuctionListingSerializer
    parser_classes = (MultiPartParser, JSONParser)

    def perform_create(self, serializer):
        with transaction.atomic():
            auction_listing = serializer.save(owner=self.request.user)

            photos_data = self.request.FILES.getlist('photos')
            for photo_data in photos_data:
                AuctionListingPhoto.objects.create(auction_listing=auction_listing, photo=photo_data)


class AuctionListingDetailAPIView(DefaultPermissionsMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = AuctionListing.objects.all()
    serializer_class = AuctionListingSerializer


class CommentListCreateAPIView(DefaultPermissionsMixin, generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        auction_id = self.kwargs.get('id')
        return Comment.objects.filter(auction_listing_id=auction_id)

    def perform_create(self, serializer):
        auction_id = self.kwargs.get('id')
        auction_listing = generics.get_object_or_404(AuctionListing, id=auction_id)
        serializer.save(commentator=self.request.user, auction_listing=auction_listing)
        self.broadcast_comment(auction_id)

    def broadcast_comment(self, auction_id):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'comments_{auction_id}',
            {
                'type': 'comment_created',
                'message': {'info': 'New comment added'}
            }
        )
