from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import Bid


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
        await self.send(text_data=json.dumps(event['message']))

    @database_sync_to_async
    def get_bids(self):
        bids = list(Bid.objects.filter(auction_listing_id=self.auction_id)
                    .values('id', 'amount', 'bidder__username', 'created_at')
                    .order_by('-created_at'))
        return {'type': 'bids', 'bids': bids}
