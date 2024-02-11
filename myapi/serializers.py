from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError

from .models import *
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise ValidationError("A user with that email already exists.")
        return value

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super(UserSerializer, self).create(validated_data)


class AuthTokenSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Unable to log in with provided credentials.')
        return user


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class BidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bid
        fields = ['id', 'bidder', 'amount', 'created_at']
        read_only_fields = ['bidder', 'created_at']


class AuctionListingPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuctionListingPhoto
        fields = ['id', 'photo']
        read_only_fields = ['id']


class AuctionListingSerializer(serializers.ModelSerializer):
    bids = BidSerializer(many=True, read_only=True)
    owner = serializers.ReadOnlyField(source='owner.username')
    photos = AuctionListingPhotoSerializer(many=True, required=False)

    class Meta:
        model = AuctionListing
        fields = [
            'id', 'title', 'description', 'starting_bid', 'current_bid', 'active', 'category', 'owner', 'bids',
            'photos', 'created_at'
        ]
        read_only_fields = ['owner', 'current_bid', 'created_at']

    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("Title must be at least 5 characters long.")
        return value

    def validate_description(self, value):
        if len(value) < 10:
            raise serializers.ValidationError("Description must be at least 10 characters long.")
        return value

    def validate_starting_bid(self, value):
        if value <= 0:
            raise serializers.ValidationError("Starting bid must be greater than 0.")
        return value


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('auction_listing', 'commentator', 'created_at')
