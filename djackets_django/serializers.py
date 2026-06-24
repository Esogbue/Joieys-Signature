from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'username', 'password')

    def validate(self, attrs):
        # Auto generate username from email if not provided
        if 'username' not in attrs or not attrs.get('username'):
            attrs['username'] = attrs['email'].split('@')[0]
        return super().validate(attrs)
