from rest_framework import serializers
from .models import MissionRequest, MissionApproval, MissionDocument
from apps.users.serializers import UserSerializer

class MissionDocumentSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)

    class Meta:
        model = MissionDocument
        fields = (
            'id', 'mission_request', 'document_type', 'file',
            'uploaded_by', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

class MissionApprovalSerializer(serializers.ModelSerializer):
    approver = UserSerializer(read_only=True)

    class Meta:
        model = MissionApproval
        fields = (
            'id', 'mission_request', 'approver', 'status',
            'comments', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

class MissionRequestSerializer(serializers.ModelSerializer):
    employee = UserSerializer(read_only=True)
    approvals = MissionApprovalSerializer(many=True, read_only=True)
    documents = MissionDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = MissionRequest
        fields = (
            'id', 'employee', 'mission_type', 'title', 'description',
            'start_date', 'end_date', 'destination', 'purpose',
            'estimated_cost', 'status', 'approvals', 'documents',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'status', 'created_at', 'updated_at')

class MissionRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MissionRequest
        fields = (
            'mission_type', 'title', 'description', 'start_date',
            'end_date', 'destination', 'purpose', 'estimated_cost'
        )

    def create(self, validated_data):
        validated_data['employee'] = self.context['request'].user
        return super().create(validated_data)

class MissionApprovalCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MissionApproval
        fields = ('status', 'comments')

    def create(self, validated_data):
        mission_request = self.context['mission_request']
        validated_data['mission_request'] = mission_request
        validated_data['approver'] = self.context['request'].user
        return super().create(validated_data)

class MissionDocumentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MissionDocument
        fields = ('document_type', 'file')

    def create(self, validated_data):
        mission_request = self.context['mission_request']
        validated_data['mission_request'] = mission_request
        validated_data['uploaded_by'] = self.context['request'].user
        return super().create(validated_data) 