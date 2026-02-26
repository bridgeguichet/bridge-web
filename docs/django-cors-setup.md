# Configuration Django CORS pour Cookies Cross-Origin

## Problème

Les cookies HttpOnly définis par Next.js (localhost:3001) ne sont **pas automatiquement envoyés** à Django (localhost:8000) car ce sont deux origines différentes.

## Solution : Configuration CORS Django

Pour permettre l'envoi de cookies cross-origin, Django doit être configuré avec `django-cors-headers`.

### 1. Installation

```bash
pip install django-cors-headers
```

### 2. Configuration Django (`settings.py`)

```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
    # ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # ⚠️ Doit être en premier
    'django.middleware.common.CommonMiddleware',
    # ...
]

# Configuration CORS pour développement
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

# ⚠️ CRITIQUE : Permet l'envoi de cookies cross-origin
CORS_ALLOW_CREDENTIALS = True

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

### 3. Configuration pour Production

```python
# settings.py (production)

if DEBUG:
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:3001",
    ]
else:
    CORS_ALLOWED_ORIGINS = [
        "https://votre-domaine.com",
        "https://www.votre-domaine.com",
    ]

# Toujours nécessaire pour les cookies
CORS_ALLOW_CREDENTIALS = True
```

### 4. Vérification

Après configuration, Django doit retourner ces headers dans la réponse :

```
Access-Control-Allow-Origin: http://localhost:3001
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: authorization, content-type, ...
```

### 5. Test

```bash
# Depuis le navigateur, vérifier que la requête inclut :
curl -v http://localhost:8000/api/auth/profile/ \
  -H "Origin: http://localhost:3001" \
  -H "Cookie: access_token=YOUR_TOKEN" \
  --cookie-jar -

# Doit retourner :
# < Access-Control-Allow-Origin: http://localhost:3001
# < Access-Control-Allow-Credentials: true
```

## Architecture Finale

```
┌─────────────────┐                    ┌─────────────────┐
│   Next.js       │                    │     Django      │
│  localhost:3001 │                    │  localhost:8000 │
└─────────────────┘                    └─────────────────┘
         │                                      │
         │  1. Login via /api/auth/login        │
         │─────────────────────────────────────>│
         │                                      │
         │  2. Set cookies (HttpOnly)           │
         │<─────────────────────────────────────│
         │                                      │
         │  3. GET /api/auth/profile/           │
         │     withCredentials: true            │
         │     Cookies auto-envoyés ✅          │
         │─────────────────────────────────────>│
         │                                      │
         │  4. Vérifie cookies + retourne data  │
         │<─────────────────────────────────────│
```

## Points Importants

1. **`CORS_ALLOW_CREDENTIALS = True`** est **obligatoire** pour les cookies
2. **`withCredentials: true`** doit être dans axios (déjà configuré dans `axiosInstance`)
3. **Ne pas utiliser `CORS_ORIGIN_ALLOW_ALL = True`** avec credentials (interdit par le navigateur)
4. Les cookies doivent avoir `SameSite=None; Secure` en production pour cross-origin

## Cookies en Production

Pour la production avec domaines différents :

```python
# Next.js API route (login)
cookieStore.set("access_token", access_token, {
  httpOnly: true,
  secure: true,              # ✅ Obligatoire en production
  sameSite: "none",          # ✅ Permet cross-origin
  maxAge: 60 * 15,
  path: "/",
});
```

**Note** : `sameSite: "none"` nécessite `secure: true` (HTTPS obligatoire).
