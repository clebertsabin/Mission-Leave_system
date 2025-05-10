from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LeaveRequestViewSet,
    LeaveApprovalViewSet,
    LeaveDocumentViewSet
)

router = DefaultRouter()
router.register(r'requests', LeaveRequestViewSet, basename='leave-request')
router.register(r'approvals', LeaveApprovalViewSet, basename='leave-approval')
router.register(r'documents', LeaveDocumentViewSet, basename='leave-document')

urlpatterns = [
    path('', include(router.urls)),
] 