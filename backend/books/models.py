from django.db import models
from users.models import UserProfile


class Book(models.Model):

    STATUS_CHOICES = [
        ('READING', 'Reading'),
        ('COMPLETED', 'Completed'),
        ('PLANNED', 'Planned'),
    ]

    owner = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name='books',
        null=True,
        blank=True,
    )
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    pages = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PLANNED')
    cover_url = models.URLField(blank=True)
    notes = models.TextField(blank=True)
    rating = models.IntegerField(null=True, blank=True, choices=[(i, i) for i in range(1, 6)])
    review = models.TextField(blank=True)
    recommended = models.BooleanField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} ({self.owner})'
