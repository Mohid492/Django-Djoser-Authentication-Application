from django.http import JsonResponse
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.tokens import default_token_generator

from .serializers import PasswordResetCodeSerializer, VerifyPasswordResetCodeSerializer
User = get_user_model()

def get_reset_data(request):
    permission_classes = [AllowAny]
    email = request.GET.get('email')
    try:
        user = User.objects.get(email=email)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        return JsonResponse({'uid': uid, 'token': token})
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

class SendResetCodeView(GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetCodeSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        code = serializer.save()
        
        # Send email with the code
        send_mail(
            'Your Password Reset Code',
            f'Use the following code to reset your password: {code}',
            settings.EMAIL_HOST_USER,
            [serializer.validated_data['email']],
            fail_silently=False,
        )
        
        return Response({"detail": "Password reset code sent."}, status=status.HTTP_200_OK)


class VerifyResetCodeView(GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = VerifyPasswordResetCodeSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.get(email=serializer.validated_data['email'])
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            return Response({"uid": uid, "token": token}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

