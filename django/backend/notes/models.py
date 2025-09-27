from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import uuid

# User Manager
class UserManager(BaseUserManager):
    def create_user(self, email, user_name, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, user_name=user_name)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, user_name, password):
        user = self.create_user(email=email, user_name=user_name, password=password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

# Custom User
class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user_name = models.CharField(max_length=100)
    user_email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'user_email'
    REQUIRED_FIELDS = ['user_name']

    def __str__(self):
        return self.user_email


# Notes
class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
