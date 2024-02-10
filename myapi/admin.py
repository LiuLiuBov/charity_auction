from django.contrib import admin
from .models import *

admin.site.register(UserProfile)
admin.site.register(Category)
admin.site.register(AuctionListing)
admin.site.register(AuctionListingPhoto)
admin.site.register(Bid)
admin.site.register(Comment)
