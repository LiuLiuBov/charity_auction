from .models import *
from django.contrib import admin

admin.site.register(UserProfile)
admin.site.register(Category)
admin.site.register(AuctionListing)
admin.site.register(AuctionListingPhoto)
admin.site.register(Bid)
admin.site.register(Comment)
admin.site.register(CustomUser)