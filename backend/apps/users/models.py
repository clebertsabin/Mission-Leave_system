from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    class Role(models.TextChoices):
        EMPLOYEE = 'EMPLOYEE', _('Employee')
        HOD = 'HOD', _('Head of Department')
        DEAN = 'DEAN', _('Dean')
        CAMPUS_ADMIN = 'CAMPUS_ADMIN', _('Campus Admin')
        FINANCIAL_MANAGER = 'FINANCIAL_MANAGER', _('Financial Manager')
        PRINCIPAL = 'PRINCIPAL', _('Principal')
        VC = 'VC', _('Vice Chancellor')
        HR = 'HR', _('Human Resources')

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.EMPLOYEE,
    )
    department = models.CharField(max_length=100, blank=True)
    employee_id = models.CharField(max_length=50, unique=True)
    phone_number = models.CharField(max_length=20, blank=True)
    signature = models.ImageField(upload_to='signatures/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        ordering = ['-date_joined']

    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"

    @property
    def is_employee(self):
        return self.role == self.Role.EMPLOYEE

    @property
    def is_hod(self):
        return self.role == self.Role.HOD

    @property
    def is_dean(self):
        return self.role == self.Role.DEAN

    @property
    def is_campus_admin(self):
        return self.role == self.Role.CAMPUS_ADMIN

    @property
    def is_financial_manager(self):
        return self.role == self.Role.FINANCIAL_MANAGER

    @property
    def is_principal(self):
        return self.role == self.Role.PRINCIPAL

    @property
    def is_vc(self):
        return self.role == self.Role.VC

    @property
    def is_hr(self):
        return self.role == self.Role.HR

    def can_approve_mission(self, mission_type):
        if mission_type == 'LOCAL':
            return self.role in [
                self.Role.HOD,
                self.Role.DEAN,
                self.Role.CAMPUS_ADMIN,
                self.Role.FINANCIAL_MANAGER,
            ]
        elif mission_type == 'INTERNATIONAL':
            return self.role in [
                self.Role.HOD,
                self.Role.DEAN,
                self.Role.PRINCIPAL,
                self.Role.VC,
            ]
        return False

    def can_approve_leave(self):
        return self.role in [
            self.Role.HOD,
            self.Role.DEAN,
            self.Role.HR,
        ]

    def can_sign_document(self, request_type):
        if request_type == 'LOCAL_MISSION':
            return self.role == self.Role.CAMPUS_ADMIN
        elif request_type == 'INTERNATIONAL_MISSION':
            return self.role == self.Role.VC
        elif request_type == 'LEAVE':
            return self.role == self.Role.HR
        return False 