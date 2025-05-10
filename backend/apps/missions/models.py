from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from simple_history.models import HistoricalRecords

class MissionRequest(models.Model):
    class MissionType(models.TextChoices):
        LOCAL = 'LOCAL', _('Local Mission')
        INTERNATIONAL = 'INTERNATIONAL', _('International Mission')

    class Status(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        APPROVED = 'APPROVED', _('Approved')
        REJECTED = 'REJECTED', _('Rejected')
        COMPLETED = 'COMPLETED', _('Completed')
        CANCELLED = 'CANCELLED', _('Cancelled')

    employee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='mission_requests'
    )
    mission_type = models.CharField(
        max_length=20,
        choices=MissionType.choices,
        default=MissionType.LOCAL
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    destination = models.CharField(max_length=200)
    purpose = models.TextField()
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    history = HistoricalRecords()

    class Meta:
        ordering = ['-created_at']
        verbose_name = _('mission request')
        verbose_name_plural = _('mission requests')

    def __str__(self):
        return f"{self.employee.get_full_name()} - {self.title}"

class MissionApproval(models.Model):
    class ApprovalStatus(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        APPROVED = 'APPROVED', _('Approved')
        REJECTED = 'REJECTED', _('Rejected')

    mission_request = models.ForeignKey(
        MissionRequest,
        on_delete=models.CASCADE,
        related_name='approvals'
    )
    approver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='mission_approvals'
    )
    status = models.CharField(
        max_length=20,
        choices=ApprovalStatus.choices,
        default=ApprovalStatus.PENDING
    )
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    history = HistoricalRecords()

    class Meta:
        ordering = ['-created_at']
        verbose_name = _('mission approval')
        verbose_name_plural = _('mission approvals')

    def __str__(self):
        return f"{self.mission_request} - {self.approver.get_full_name()}"

class MissionDocument(models.Model):
    class DocumentType(models.TextChoices):
        REQUEST = 'REQUEST', _('Request Document')
        APPROVAL = 'APPROVAL', _('Approval Document')
        REPORT = 'REPORT', _('Mission Report')

    mission_request = models.ForeignKey(
        MissionRequest,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    document_type = models.CharField(
        max_length=20,
        choices=DocumentType.choices,
        default=DocumentType.REQUEST
    )
    file = models.FileField(upload_to='mission_documents/')
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='uploaded_documents'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = _('mission document')
        verbose_name_plural = _('mission documents')

    def __str__(self):
        return f"{self.mission_request} - {self.document_type}" 