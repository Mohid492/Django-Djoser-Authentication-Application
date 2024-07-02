from djoser.serializers import UserCreateSerializer
from .models import *
from rest_framework import serializers
from django.contrib.auth import get_user_model
import random

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model=User
        fields=('id', 'email', 'name', 'password')

User = get_user_model()

class PasswordResetCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")
        return value

    def save(self):
        email = self.validated_data['email']
        user = User.objects.get(email=email)
        code = f"{random.randint(10000, 99999)}"
        PasswordResetCode.objects.update_or_create(user=user, defaults={'code': code})
        return code

# core/serializers.py
# serializers.py
class VerifyPasswordResetCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)

    def validate(self, data):
        email = data.get('email')
        code = data.get('code')

        try:
            user = User.objects.get(email=email)
            reset_code = PasswordResetCode.objects.get(user=user)
            if reset_code.code != code:
                raise serializers.ValidationError("Invalid verification code.")
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")
        except PasswordResetCode.DoesNotExist:
            raise serializers.ValidationError("Verification code does not exist.")

        return data
