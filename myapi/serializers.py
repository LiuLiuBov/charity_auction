from rest_framework import serializers
from .models import Bid


class BidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bid
        fields = ['id', 'bidder', 'auction_listing', 'amount']
        read_only_fields = ['bidder']
