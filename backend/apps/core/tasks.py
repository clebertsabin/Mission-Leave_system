from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from .utils import create_mission_pdf, create_leave_pdf
import os

@shared_task
def generate_mission_pdf(mission_request_id):
    from apps.missions.models import MissionRequest
    mission_request = MissionRequest.objects.get(id=mission_request_id)
    approvals = mission_request.approvals.all()
    
    # Generate PDF
    pdf_buffer = create_mission_pdf(mission_request, approvals)
    
    # Save PDF to media directory
    pdf_path = os.path.join(
        settings.MEDIA_ROOT,
        'mission_documents',
        f'mission_{mission_request_id}.pdf'
    )
    os.makedirs(os.path.dirname(pdf_path), exist_ok=True)
    
    with open(pdf_path, 'wb') as f:
        f.write(pdf_buffer.getvalue())
    
    # Send email notification
    context = {
        'mission_request': mission_request,
        'pdf_url': f"{settings.MEDIA_URL}mission_documents/mission_{mission_request_id}.pdf"
    }
    
    html_message = render_to_string('emails/mission_approved.html', context)
    plain_message = render_to_string('emails/mission_approved.txt', context)
    
    send_mail(
        subject=f'Mission Request Approved: {mission_request.title}',
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[mission_request.employee.email],
        html_message=html_message
    )

@shared_task
def generate_leave_pdf(leave_request_id):
    from apps.leave.models import LeaveRequest
    leave_request = LeaveRequest.objects.get(id=leave_request_id)
    approvals = leave_request.approvals.all()
    
    # Generate PDF
    pdf_buffer = create_leave_pdf(leave_request, approvals)
    
    # Save PDF to media directory
    pdf_path = os.path.join(
        settings.MEDIA_ROOT,
        'leave_documents',
        f'leave_{leave_request_id}.pdf'
    )
    os.makedirs(os.path.dirname(pdf_path), exist_ok=True)
    
    with open(pdf_path, 'wb') as f:
        f.write(pdf_buffer.getvalue())
    
    # Send email notification
    context = {
        'leave_request': leave_request,
        'pdf_url': f"{settings.MEDIA_URL}leave_documents/leave_{leave_request_id}.pdf"
    }
    
    html_message = render_to_string('emails/leave_approved.html', context)
    plain_message = render_to_string('emails/leave_approved.txt', context)
    
    send_mail(
        subject=f'Leave Request Approved: {leave_request.get_leave_type_display()}',
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[leave_request.employee.email],
        html_message=html_message
    )

@shared_task
def send_approval_notification(request_type, request_id, approver_email):
    if request_type == 'mission':
        from apps.missions.models import MissionRequest
        request_obj = MissionRequest.objects.get(id=request_id)
    else:
        from apps.leave.models import LeaveRequest
        request_obj = LeaveRequest.objects.get(id=request_id)
    
    context = {
        'request': request_obj,
        'request_type': request_type
    }
    
    html_message = render_to_string('emails/approval_required.html', context)
    plain_message = render_to_string('emails/approval_required.txt', context)
    
    send_mail(
        subject=f'Approval Required: {request_type.title()} Request',
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[approver_email],
        html_message=html_message
    ) 