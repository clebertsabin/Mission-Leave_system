from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MissionRequestViewSet,
    MissionApprovalViewSet,
    MissionDocumentViewSet
)

router = DefaultRouter()
router.register(r'requests', MissionRequestViewSet, basename='mission-request')
router.register(r'approvals', MissionApprovalViewSet, basename='mission-approval')
router.register(r'documents', MissionDocumentViewSet, basename='mission-document')

urlpatterns = [
    path('', include(router.urls)),
] 