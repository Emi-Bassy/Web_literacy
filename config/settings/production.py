from .base import *

DEBUG = False

ALLOWED_HOSTS = ["*"]

CSRF_TRUSTED_ORIGINS = ['https://jissyu3.net']


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'django_db',
        "USER": "akahoshi2",
        "PASSWORD": "Warthunder0310",
        "HOST": "localhost",
        "PORT": "",
    }
}