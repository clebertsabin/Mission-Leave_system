from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from io import BytesIO
from PIL import Image
import os
from django.conf import settings

def create_mission_pdf(mission_request, approvals):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=30
    )
    story.append(Paragraph(f"Mission Request: {mission_request.title}", title_style))
    story.append(Spacer(1, 12))

    # Mission Details
    details_style = styles['Normal']
    story.append(Paragraph(f"Employee: {mission_request.employee.get_full_name()}", details_style))
    story.append(Paragraph(f"Department: {mission_request.employee.department}", details_style))
    story.append(Paragraph(f"Mission Type: {mission_request.get_mission_type_display()}", details_style))
    story.append(Paragraph(f"Destination: {mission_request.destination}", details_style))
    story.append(Paragraph(f"Start Date: {mission_request.start_date}", details_style))
    story.append(Paragraph(f"End Date: {mission_request.end_date}", details_style))
    story.append(Paragraph(f"Purpose: {mission_request.purpose}", details_style))
    story.append(Paragraph(f"Estimated Cost: ${mission_request.estimated_cost}", details_style))
    story.append(Spacer(1, 20))

    # Approval Chain
    story.append(Paragraph("Approval Chain:", styles['Heading2']))
    for approval in approvals:
        story.append(Paragraph(
            f"{approval.approver.get_full_name()} ({approval.approver.get_role_display()}) - "
            f"{approval.get_status_display()}",
            details_style
        ))
        if approval.comments:
            story.append(Paragraph(f"Comments: {approval.comments}", details_style))
        story.append(Spacer(1, 12))

    # Add signatures if available
    if mission_request.status == 'APPROVED':
        story.append(Spacer(1, 30))
        story.append(Paragraph("Signatures:", styles['Heading2']))
        
        # Add final approver's signature
        final_approval = approvals.last()
        if final_approval and final_approval.approver.signature:
            signature_path = os.path.join(settings.MEDIA_ROOT, str(final_approval.approver.signature))
            if os.path.exists(signature_path):
                img = Image.open(signature_path)
                img_width, img_height = img.size
                aspect = img_height / float(img_width)
                img_width = 2 * inch
                img_height = img_width * aspect
                story.append(Paragraph(
                    f"Signed by: {final_approval.approver.get_full_name()}",
                    details_style
                ))
                story.append(Spacer(1, 12))

    doc.build(story)
    buffer.seek(0)
    return buffer

def create_leave_pdf(leave_request, approvals):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=30
    )
    story.append(Paragraph(f"Leave Request: {leave_request.get_leave_type_display()}", title_style))
    story.append(Spacer(1, 12))

    # Leave Details
    details_style = styles['Normal']
    story.append(Paragraph(f"Employee: {leave_request.employee.get_full_name()}", details_style))
    story.append(Paragraph(f"Department: {leave_request.employee.department}", details_style))
    story.append(Paragraph(f"Leave Type: {leave_request.get_leave_type_display()}", details_style))
    story.append(Paragraph(f"Start Date: {leave_request.start_date}", details_style))
    story.append(Paragraph(f"End Date: {leave_request.end_date}", details_style))
    story.append(Paragraph(f"Duration: {leave_request.duration} days", details_style))
    story.append(Paragraph(f"Reason: {leave_request.reason}", details_style))
    story.append(Spacer(1, 20))

    # Approval Chain
    story.append(Paragraph("Approval Chain:", styles['Heading2']))
    for approval in approvals:
        story.append(Paragraph(
            f"{approval.approver.get_full_name()} ({approval.approver.get_role_display()}) - "
            f"{approval.get_status_display()}",
            details_style
        ))
        if approval.comments:
            story.append(Paragraph(f"Comments: {approval.comments}", details_style))
        story.append(Spacer(1, 12))

    # Add signatures if available
    if leave_request.status == 'APPROVED':
        story.append(Spacer(1, 30))
        story.append(Paragraph("Signatures:", styles['Heading2']))
        
        # Add final approver's signature
        final_approval = approvals.last()
        if final_approval and final_approval.approver.signature:
            signature_path = os.path.join(settings.MEDIA_ROOT, str(final_approval.approver.signature))
            if os.path.exists(signature_path):
                img = Image.open(signature_path)
                img_width, img_height = img.size
                aspect = img_height / float(img_width)
                img_width = 2 * inch
                img_height = img_width * aspect
                story.append(Paragraph(
                    f"Signed by: {final_approval.approver.get_full_name()}",
                    details_style
                ))
                story.append(Spacer(1, 12))

    doc.build(story)
    buffer.seek(0)
    return buffer 