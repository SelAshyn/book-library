from django.db import models


class UserProfile(models.Model):
    """
    Represents a Novella user. Identity is managed by Firebase —
    we store the Firebase UID as the primary identifier and mirror
    basic profile info for convenience.
    """
    firebase_uid = models.CharField(max_length=128, unique=True, db_index=True)
    email = models.EmailField(blank=True)
    display_name = models.CharField(max_length=255, blank=True)
    photo_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Required by DRF's IsAuthenticated permission check
    @property
    def is_authenticated(self):
        return True

    def __str__(self):
        return self.display_name or self.email or self.firebase_uid
