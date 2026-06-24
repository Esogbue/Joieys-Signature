from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('djoser.urls')),
    path('api/v1/', include('djoser.urls.authtoken')),
    path('api/v1/', include('product.urls')),
    path('api/v1/', include('order.urls')),
    path('api/v1/register/', views.register),
    path('api/v1/login/', views.login),
    path('api/v1/forgot-password/', views.forgot_password),
    path('api/v1/reset-password/', views.reset_password),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
