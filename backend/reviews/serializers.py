from rest_framework import serializers
from .models import Review
from books.serializers import BookSerializer


class ReviewSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    book_id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = Review
        fields = ['id', 'book', 'book_id', 'rating', 'body', 'recommended', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_book_id(self, book_id):
        """Ensure the book belongs to the requesting user."""
        from books.models import Book
        request = self.context['request']
        try:
            book = Book.objects.get(id=book_id)
            if book.owner != request.user:
                raise serializers.ValidationError('You can only review your own books.')
            return book_id
        except Book.DoesNotExist:
            raise serializers.ValidationError('Book not found.')

    def create(self, validated_data):
        from books.models import Book
        book_id = validated_data.pop('book_id')
        book = Book.objects.get(id=book_id)
        review = Review.objects.create(
            owner=self.context['request'].user,
            book=book,
            **validated_data
        )
        return review
