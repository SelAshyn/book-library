from django.contrib import admin
from .models import VocabularyWord


@admin.register(VocabularyWord)
class VocabularyWordAdmin(admin.ModelAdmin):
    list_display = ['word', 'book', 'owner', 'created_at']
    search_fields = ['word', 'book__title', 'owner__email']
    readonly_fields = ['created_at']
