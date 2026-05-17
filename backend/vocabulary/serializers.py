from rest_framework import serializers
from .models import VocabularyWord


class VocabularyWordSerializer(serializers.ModelSerializer):
    class Meta:
        model = VocabularyWord
        fields = ['id', 'book', 'word', 'meaning', 'example', 'created_at']
        read_only_fields = ['id', 'created_at']
