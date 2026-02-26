# Configuration Backend Django pour Next.js

Configuration Django pour fonctionner avec Next.js et les cookies HttpOnly.

## 1. Installation des dépendances

```bash
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt
```

## 2. Configuration CORS (settings.py)

```python
# settings.py

INSTALLED_APPS = [
    # ...
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Doit être en premier
    'django.middleware.common.CommonMiddleware',
    # ... autres middlewares
]

# Configuration CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Next.js dev
    "https://votre-domaine.com",  # Production
]

CORS_ALLOW_CREDENTIALS = True  # IMPORTANT : Permet l'envoi des cookies

# Headers autorisés
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Méthodes autorisées
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
```

## 3. Configuration JWT (settings.py)

```python
from datetime import timedelta

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,

    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}
```

## 4. Views d'authentification (views.py)

```python
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Endpoint de connexion appelé par Next.js API route
    Retourne access_token et refresh_token
    """
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response(
            {'error': 'Email et mot de passe requis'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=email, password=password)

    if user is None:
        return Response(
            {'error': 'Identifiants invalides'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not user.is_active:
        return Response(
            {'error': 'Compte désactivé'},
            status=status.HTTP_403_FORBIDDEN
        )

    # Génération des tokens JWT
    refresh = RefreshToken.for_user(user)

    return Response({
        'access_token': str(refresh.access_token),
        'refresh_token': str(refresh),
        'user': {
            'id': str(user.id),
            'email': user.email,
            'name': user.get_full_name() or user.username,
        }
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    """
    Endpoint de déconnexion
    Blacklist le refresh token si configuré
    """
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'success': True})
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token_view(request):
    """
    Endpoint pour rafraîchir l'access token
    """
    refresh_token = request.data.get('refresh_token')

    if not refresh_token:
        return Response(
            {'error': 'Refresh token requis'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        refresh = RefreshToken(refresh_token)
        return Response({
            'access_token': str(refresh.access_token),
        })
    except Exception as e:
        return Response(
            {'error': 'Token invalide ou expiré'},
            status=status.HTTP_401_UNAUTHORIZED
        )
```

## 5. URLs (urls.py)

```python
from django.urls import path
from . import views

urlpatterns = [
    path('api/auth/login/', views.login_view, name='login'),
    path('api/auth/logout/', views.logout_view, name='logout'),
    path('api/auth/refresh/', views.refresh_token_view, name='refresh'),
]
```

## 6. Middleware pour extraire le token des cookies (optionnel)

Si vous voulez que Django lise automatiquement les cookies :

```python
# middleware.py
from rest_framework_simplejwt.authentication import JWTAuthentication

class JWTCookieAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Essayer d'abord le header Authorization
        header = self.get_header(request)

        if header is None:
            # Si pas de header, chercher dans les cookies
            raw_token = request.COOKIES.get('access_token')
        else:
            raw_token = self.get_raw_token(header)

        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token
```

Puis dans `settings.py` :

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'votre_app.middleware.JWTCookieAuthentication',
    ),
}
```

## 7. Protection des endpoints

```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    """
    Endpoint protégé - nécessite un token valide
    """
    return Response({
        'message': 'Accès autorisé',
        'user': request.user.email
    })
```

## 8. Variables d'environnement (.env)

```env
SECRET_KEY=votre_secret_key_django
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,votre-domaine.com
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://votre-domaine.com
```

## Notes importantes

- ✅ `CORS_ALLOW_CREDENTIALS = True` est **obligatoire** pour les cookies
- ✅ Les tokens sont générés par Django et envoyés à Next.js
- ✅ Next.js set les cookies HttpOnly côté client
- ✅ Les requêtes directes de Next.js → Django incluent automatiquement les cookies
- ✅ Django peut lire les cookies si vous utilisez le middleware personnalisé
