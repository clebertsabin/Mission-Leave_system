from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import MissionRequest, MissionApproval, MissionDocument
from .serializers import (
    MissionRequestSerializer, MissionRequestCreateSerializer,
    MissionApprovalSerializer, MissionApprovalCreateSerializer,
    MissionDocumentSerializer, MissionDocumentCreateSerializer
)

class MissionRequestViewSet(viewsets.ModelViewSet):
    serializer_class = MissionRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_employee:
            return MissionRequest.objects.filter(employee=user)
        elif user.is_hod:
            return MissionRequest.objects.filter(employee__department=user.department)
        elif user.is_dean:
            return MissionRequest.objects.all()
        elif user.is_campus_admin:
            return MissionRequest.objects.filter(mission_type='LOCAL')
        elif user.is_financial_manager:
            return MissionRequest.objects.filter(mission_type='LOCAL')
        elif user.is_principal:
            return MissionRequest.objects.filter(mission_type='INTERNATIONAL')
        elif user.is_vc:
            return MissionRequest.objects.filter(mission_type='INTERNATIONAL')
        return MissionRequest.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return MissionRequestCreateSerializer
        return MissionRequestSerializer

    def perform_create(self, serializer):
        serializer.save(employee=self.request.user)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        mission_request = self.get_object()
        user = request.user

        if not user.can_approve_mission(mission_request.mission_type):
            return Response(
                {"detail": "You don't have permission to approve this mission request."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = MissionApprovalCreateSerializer(
            data=request.data,
            context={'mission_request': mission_request, 'request': request}
        )

        if serializer.is_valid():
            approval = serializer.save()
            
            # Update mission request status based on approval
            if approval.status == 'APPROVED':
                if mission_request.mission_type == 'LOCAL':
                    if user.is_financial_manager:
                        mission_request.status = 'APPROVED'
                elif mission_request.mission_type == 'INTERNATIONAL':
                    if user.is_vc:
                        mission_request.status = 'APPROVED'
            elif approval.status == 'REJECTED':
                mission_request.status = 'REJECTED'
            
            mission_request.save()
            return Response(MissionApprovalSerializer(approval).data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def upload_document(self, request, pk=None):
        mission_request = self.get_object()
        serializer = MissionDocumentCreateSerializer(
            data=request.data,
            context={'mission_request': mission_request, 'request': request}
        )

        if serializer.is_valid():
            document = serializer.save()
            return Response(MissionDocumentSerializer(document).data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def pending_approvals(self, request):
        user = request.user
        if not user.can_approve_mission('LOCAL') and not user.can_approve_mission('INTERNATIONAL'):
            return Response(
                {"detail": "You don't have permission to approve mission requests."},
                status=status.HTTP_403_FORBIDDEN
            )

        mission_requests = self.get_queryset().filter(status='PENDING')
        serializer = self.get_serializer(mission_requests, many=True)
        return Response(serializer.data)

class MissionApprovalViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MissionApprovalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_employee:
            return MissionApproval.objects.filter(mission_request__employee=user)
        return MissionApproval.objects.filter(approver=user)

class MissionDocumentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MissionDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_employee:
            return MissionDocument.objects.filter(mission_request__employee=user)
        return MissionDocument.objects.filter(mission_request__in=self.request.user.mission_approvals.values('mission_request')) 