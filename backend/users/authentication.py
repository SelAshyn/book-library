import os
import json
import base64
import tempfile
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from users.models import UserProfile


def _initialize_firebase():
    """Initialize Firebase Admin SDK once."""
    if not firebase_admin._apps:
        b64 = os.environ.get('FIREBASE_CREDENTIALS_BASE64')
        if b64:
            try:
                cred_dict = json.loads(base64.b64decode(b64).decode())
                cred = credentials.Certificate(cred_dict)
            except Exception as e:
                raise RuntimeError(f'Failed to decode FIREBASE_CREDENTIALS_BASE64: {e}')
        else:
            cred_path = settings.FIREBASE_CREDENTIALS
            if not os.path.exists(cred_path):
                raise RuntimeError(f'Firebase credentials file not found: {cred_path}. Set FIREBASE_CREDENTIALS_BASE64 env var.')
            cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)


class FirebaseAuthentication(BaseAuthentication):
    """
    Authenticates requests using a Firebase ID token passed as:
        Authorization: Bearer <firebase_id_token>

    On success, sets request.user to the matching UserProfile instance
    and request.auth to the decoded Firebase token payload.
    """

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return None  # Let other authenticators or anonymous access handle it

        id_token = auth_header.split('Bearer ')[1].strip()
        if not id_token:
            return None

        try:
            _initialize_firebase()
        except RuntimeError as e:
            raise AuthenticationFailed(str(e))

        try:
            decoded_token = firebase_auth.verify_id_token(id_token)
        except firebase_auth.ExpiredIdTokenError:
            raise AuthenticationFailed('Firebase token has expired.')
        except firebase_auth.InvalidIdTokenError:
            raise AuthenticationFailed('Invalid Firebase token.')
        except Exception as e:
            raise AuthenticationFailed(f'Firebase authentication failed: {str(e)}')

        uid = decoded_token['uid']

        # Get or create a UserProfile for this Firebase user
        profile, _ = UserProfile.objects.get_or_create(
            firebase_uid=uid,
            defaults={
                'email': decoded_token.get('email', ''),
                'display_name': decoded_token.get('name', ''),
                'photo_url': decoded_token.get('picture', ''),
            },
        )

        # Keep email/name in sync if they changed in Firebase
        updated = False
        if profile.email != decoded_token.get('email', ''):
            profile.email = decoded_token.get('email', '')
            updated = True
        if profile.display_name != decoded_token.get('name', ''):
            profile.display_name = decoded_token.get('name', '')
            updated = True
        if updated:
            profile.save(update_fields=['email', 'display_name'])

        return (profile, decoded_token)
