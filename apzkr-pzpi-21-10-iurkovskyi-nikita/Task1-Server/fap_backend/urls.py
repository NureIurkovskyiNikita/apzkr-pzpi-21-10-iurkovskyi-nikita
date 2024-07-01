from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static

#Тут основні URL-маршрути для програми Django
schema_view = get_schema_view(
    openapi.Info(
        title='Food AutoPlacer API',
        default_version='v1',
        description='An API that describes Food AutoPlacer endpoints',
        terms_of_service='https://www.google.com/policies/terms/',
        contact=openapi.Contact(email='yrkovskiynik@gmail.com'),
        license=openapi.License(name='BSD License'),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

#Тут визначаємо основні URL-маршрути нашої програми
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('auth/', include('djoser.urls')),

    #Включають інтерфейси Swagger та ReDoc для перегляду документації API.
    path('swagger/', schema_view.with_ui(
        'swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui(
            'redoc', cache_timeout=0), name='schema-redoc'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
