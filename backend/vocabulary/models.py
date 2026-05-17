from django.db import models
from users.models import UserProfile
from books.models import Book


class VocabularyWord(models.Model):
    owner = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name='vocabulary',
    )
    book = models.ForeignKey(
        Book,
        on_delete=models.CASCADE,
        related_name='vocabulary',
        null=True,
        blank=True,
    )
    word = models.CharField(max_length=255)
    meaning = models.TextField(blank=True)
    example = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.word} ({self.owner})'
