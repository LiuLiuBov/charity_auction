from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.utils import timezone


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    profile_photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s profile"

class Category(models.Model):
    title = models.CharField(max_length=64)

    def __str__(self):
        return f"{self.title}"

class AuctionListing(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='auction_listings')
    title = models.CharField(max_length=255)
    description = models.TextField()
    starting_bid = models.DecimalField(max_digits=10, decimal_places=2)
    current_bid = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=None)
    active = models.BooleanField(default=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='auctions', null=True)

    def __str__(self):
        return f"{self.title}"

class AuctionListingPhoto(models.Model):
    auction_listing = models.ForeignKey(AuctionListing, on_delete=models.CASCADE, related_name='photos')
    photo = models.ImageField(upload_to='auction_photos/')

class Bid(models.Model):
    bidder = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bids')
    auction_listing = models.ForeignKey(AuctionListing, on_delete=models.CASCADE, related_name='bids')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(default=timezone.now)

class Comment(models.Model):
    commentator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    auction_listing = models.ForeignKey(AuctionListing, on_delete=models.CASCADE, related_name='comments')
    text = models.CharField(max_length=1000)

    def __str__(self):
        return f"{self.text}"
