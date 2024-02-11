from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
import json


class BidConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.auction_id = self.scope['url_route']['kwargs']['id']
        self.auction_group_name = f'auction_{self.auction_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.auction_group_name,
            self.channel_name
        )

        await self.accept()

        # Send current bids to just connected user
        bids = await self.get_bids()
        await self.send(text_data=json.dumps(bids))

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.auction_group_name,
            self.channel_name
        )

    async def broadcast_bid(self, event):
        bids = await self.get_bids()
        await self.send(text_data=json.dumps(bids))

    @database_sync_to_async
    def get_bids(self):
        from .models import Bid
        from .serializers import BidSerializer

        bids_queryset = Bid.objects.filter(auction_listing_id=self.auction_id).order_by('-created_at')
        serializer = BidSerializer(bids_queryset, many=True)

        return {'type': 'bids', 'bids': serializer.data}


class CommentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.auction_id = self.scope['url_route']['kwargs']['id']
        self.auction_group_name = f'comments_{self.auction_id}'

        await self.channel_layer.group_add(self.auction_group_name, self.channel_name)
        await self.accept()

        comments = await self.get_comments()
        await self.send(text_data=json.dumps(comments))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.auction_group_name, self.channel_name)

    async def comment_created(self, event):
        comments = await self.get_comments()
        await self.send(text_data=json.dumps(comments))

    @database_sync_to_async
    def get_comments(self):
        from .models import Comment
        from .serializers import CommentSerializer

        comment_queryset = Comment.objects.filter(auction_listing_id=self.auction_id)
        serializer = CommentSerializer(comment_queryset, many=True)

        return {'type': 'comments', 'comments': serializer.data}
