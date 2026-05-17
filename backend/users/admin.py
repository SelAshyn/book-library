from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['display_name', 'email', 'firebase_uid', 'created_at']
    search_fields = ['display_name', 'email', 'firebase_uid']
    readonly_fields = ['firebase_uid', 'created_at', 'updated_at']
