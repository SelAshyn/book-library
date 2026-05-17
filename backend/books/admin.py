from django.contrib import admin
from .models import Book


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'status', 'rating', 'recommended', 'owner', 'created_at']
    list_filter = ['status', 'rating', 'recommended']
    search_fields = ['title', 'author', 'owner__email', 'owner__display_name']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Book Info', {
            'fields': ('title', 'author', 'pages', 'cover_url', 'owner')
        }),
        ('Reading Status', {
            'fields': ('status', 'notes')
        }),
        ('Review', {
            'fields': ('rating', 'review', 'recommended')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at')
        }),
    )
