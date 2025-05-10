from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import LeaveRequest, LeaveApproval, LeaveDocument
from .serializers import (
    LeaveRequestSerializer, LeaveRequestCreateSerializer,
    LeaveApprovalSerializer, LeaveApprovalCreateSerializer,
    LeaveDocumentSerializer, LeaveDocumentCreateSerializer
)

class LeaveRequestViewSet(viewsets.ModelViewSet):
    serializer_class = LeaveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_employee:
            return LeaveRequest.objects.filter(employee=user)
        elif user.is_hod:
            return LeaveRequest.objects.filter(employee__department=user.department)
        elif user.is_dean:
            return LeaveRequest.objects.all()
        elif user.is_hr:
            return LeaveRequest.objects.all()
        return LeaveRequest.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return LeaveRequestCreateSerializer
        return LeaveRequestSerializer

    def perform_create(self, serializer):
        serializer.save(employee=self.request.user)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        leave_request = self.get_object()
        user = request.user

        if not user.can_approve_leave():
            return Response(
                {"detail": "You don't have permission to approve leave requests."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = LeaveApprovalCreateSerializer(
            data=request.data,
            context={'leave_request': leave_request, 'request': request}
        )

        if serializer.is_valid():
            approval = serializer.save()
            
            # Update leave request status based on approval
            if approval.status == 'APPROVED':
                if user.is_hr:
                    leave_request.status = 'APPROVED'
            elif approval.status == 'REJECTED':
                leave_request.status = 'REJECTED'
            
            leave_request.save()
            return Response(LeaveApprovalSerializer(approval).data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def upload_document(self, request, pk=None):
        leave_request = self.get_object()
        serializer = LeaveDocumentCreateSerializer(
            data=request.data,
            context={'leave_request': leave_request, 'request': request}
        )

        if serializer.is_valid():
            document = serializer.save()
            return Response(LeaveDocumentSerializer(document).data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def pending_approvals(self, request):
        user = request.user
        if not user.can_approve_leave():
            return Response(
                {"detail": "You don't have permission to approve leave requests."},
                status=status.HTTP_403_FORBIDDEN
            )

        leave_requests = self.get_queryset().filter(status='PENDING')
        serializer = self.get_serializer(leave_requests, many=True)
        return Response(serializer.data)

class LeaveApprovalViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LeaveApprovalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_employee:
            return LeaveApproval.objects.filter(leave_request__employee=user)
        return LeaveApproval.objects.filter(approver=user)

class LeaveDocumentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LeaveDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_employee:
            return LeaveDocument.objects.filter(leave_request__employee=user)
        return LeaveDocument.objects.filter(leave_request__in=self.request.user.leave_approvals.values('leave_request')) 