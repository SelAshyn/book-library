from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from users.models import UserProfile
from books.models import Book


class Review(models.Model):
    owner = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name='reviews',
    )
    book = models.ForeignKey(
        Book,
        on_delete=models.CASCADE,
        related_name='reviews',
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )
    body = models.TextField(blank=True)
    recommended = models.BooleanField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        # One review per user per book
        unique_together = [('owner', 'book')]

    def __str__(self):
        return f'{self.owner} — {self.book.title} ({self.rating}★)'
