from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserProfileSerializer


class MeView(APIView):
    """
    GET  /api/users/me/  — return the authenticated user's profile
    PATCH /api/users/me/ — update display_name or photo_url
    """

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
