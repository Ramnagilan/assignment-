from django.urls import path
from .views import register_user, login_user, notes_list_create, note_detail

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('notes/', notes_list_create, name='notes_list_create'),
    path('notes/<int:pk>/', note_detail, name='note_detail'),
]
