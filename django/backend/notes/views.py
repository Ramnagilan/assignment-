from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Note
from .serializers import UserSerializer, NoteSerializer

# Register User
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Login User and return JWT tokens
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')
    print("email:",email, "Password:",password)
    user = authenticate(request, username=email, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'user_id': str(user.user_id),
                'user_name': user.user_name,
                'user_email': user.user_email
            }
        }, status=status.HTTP_200_OK)

    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


# List and Create Notes
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def notes_list_create(request):
    if request.method == 'GET':
        notes = Note.objects.filter(user=request.user)
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Retrieve, Update, Delete Single Note
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def note_detail(request, pk):
    note = get_object_or_404(Note, pk=pk, user=request.user)

    if request.method == 'GET':
        serializer = NoteSerializer(note)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = NoteSerializer(note, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        note.delete()
        return Response({'message': 'Note deleted'}, status=status.HTTP_204_NO_CONTENT)
