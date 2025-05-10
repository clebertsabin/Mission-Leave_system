from rest_framework import serializers
from .models import LeaveRequest, LeaveApproval, LeaveDocument
from apps.users.serializers import UserSerializer

class LeaveDocumentSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)

    class Meta:
        model = LeaveDocument
        fields = (
            'id', 'leave_request', 'document_type', 'file',
            'uploaded_by', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

class LeaveApprovalSerializer(serializers.ModelSerializer):
    approver = UserSerializer(read_only=True)

    class Meta:
        model = LeaveApproval
        fields = (
            'id', 'leave_request', 'approver', 'status',
            'comments', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

class LeaveRequestSerializer(serializers.ModelSerializer):
    employee = UserSerializer(read_only=True)
    approvals = LeaveApprovalSerializer(many=True, read_only=True)
    documents = LeaveDocumentSerializer(many=True, read_only=True)
    duration = serializers.IntegerField(read_only=True)

    class Meta:
        model = LeaveRequest
        fields = (
            'id', 'employee', 'leave_type', 'start_date', 'end_date',
            'reason', 'status', 'duration', 'approvals', 'documents',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'status', 'duration', 'created_at', 'updated_at')

class LeaveRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveRequest
        fields = ('leave_type', 'start_date', 'end_date', 'reason')

    def create(self, validated_data):
        validated_data['employee'] = self.context['request'].user
        return super().create(validated_data)

    def validate(self, attrs):
        if attrs['start_date'] > attrs['end_date']:
            raise serializers.ValidationError("End date must be after start date")
        return attrs

class LeaveApprovalCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveApproval
        fields = ('status', 'comments')

    def create(self, validated_data):
        leave_request = self.context['leave_request']
        validated_data['leave_request'] = leave_request
        validated_data['approver'] = self.context['request'].user
        return super().create(validated_data)

class LeaveDocumentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveDocument
        fields = ('document_type', 'file')

    def create(self, validated_data):
        leave_request = self.context['leave_request']
        validated_data['leave_request'] = leave_request
        validated_data['uploaded_by'] = self.context['request'].user
        return super().create(validated_data) 