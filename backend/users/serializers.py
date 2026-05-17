from rest_framework import serializers
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'firebase_uid', 'email', 'display_name', 'photo_url', 'created_at']
        read_only_fields = ['id', 'firebase_uid', 'created_at']
