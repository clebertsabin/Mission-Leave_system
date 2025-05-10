from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from simple_history.models import HistoricalRecords

class LeaveRequest(models.Model):
    class LeaveType(models.TextChoices):
        ANNUAL = 'ANNUAL', _('Annual Leave')
        SICK = 'SICK', _('Sick Leave')
        MATERNITY = 'MATERNITY', _('Maternity Leave')
        PATERNITY = 'PATERNITY', _('Paternity Leave')
        STUDY = 'STUDY', _('Study Leave')
        UNPAID = 'UNPAID', _('Unpaid Leave')
        OTHER = 'OTHER', _('Other')

    class Status(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        APPROVED = 'APPROVED', _('Approved')
        REJECTED = 'REJECTED', _('Rejected')
        CANCELLED = 'CANCELLED', _('Cancelled')

    employee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='leave_requests'
    )
    leave_type = models.CharField(
        max_length=20,
        choices=LeaveType.choices,
        default=LeaveType.ANNUAL
    )
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
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
        verbose_name = _('leave request')
        verbose_name_plural = _('leave requests')

    def __str__(self):
        return f"{self.employee.get_full_name()} - {self.leave_type}"

    @property
    def duration(self):
        return (self.end_date - self.start_date).days + 1

class LeaveApproval(models.Model):
    class ApprovalStatus(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        APPROVED = 'APPROVED', _('Approved')
        REJECTED = 'REJECTED', _('Rejected')

    leave_request = models.ForeignKey(
        LeaveRequest,
        on_delete=models.CASCADE,
        related_name='approvals'
    )
    approver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='leave_approvals'
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
        verbose_name = _('leave approval')
        verbose_name_plural = _('leave approvals')

    def __str__(self):
        return f"{self.leave_request} - {self.approver.get_full_name()}"

class LeaveDocument(models.Model):
    class DocumentType(models.TextChoices):
        REQUEST = 'REQUEST', _('Request Document')
        APPROVAL = 'APPROVAL', _('Approval Document')
        MEDICAL = 'MEDICAL', _('Medical Certificate')
        OTHER = 'OTHER', _('Other Document')

    leave_request = models.ForeignKey(
        LeaveRequest,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    document_type = models.CharField(
        max_length=20,
        choices=DocumentType.choices,
        default=DocumentType.REQUEST
    )
    file = models.FileField(upload_to='leave_documents/')
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='uploaded_leave_documents'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = _('leave document')
        verbose_name_plural = _('leave documents')

    def __str__(self):
        return f"{self.leave_request} - {self.document_type}" 