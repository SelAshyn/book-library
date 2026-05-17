from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Review
from .serializers import ReviewSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    """
    CRUD for reviews. Users only see and manage their own reviews.
    """
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(owner=self.request.user).select_related('book')
