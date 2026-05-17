from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import VocabularyWord
from .serializers import VocabularyWordSerializer


class VocabularyViewSet(viewsets.ModelViewSet):
    serializer_class = VocabularyWordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = VocabularyWord.objects.filter(owner=self.request.user)
        book_id = self.request.query_params.get('book')
        if book_id:
            qs = qs.filter(book_id=book_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
