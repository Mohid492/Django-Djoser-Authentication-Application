from django.http import JsonResponse
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny

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
