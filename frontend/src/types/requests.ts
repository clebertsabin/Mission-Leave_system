import { User } from './auth';

export type MissionType = 'local' | 'international';
export type LeaveType = 'annual' | 'sick' | 'study' | 'maternity' | 'paternity' | 'unpaid';
export type RequestStatus = 'pending' | 'approved' | 'rejected';
export type ApprovalRole = 'employee' | 'hod' | 'dean' | 'campus_admin' | 'financial_manager' | 'principal' | 'vice_chancellor' | 'hr_manager';

export interface ApprovalStep {
  role: ApprovalRole;
  status: RequestStatus;
  comment?: string;
  approvedAt?: string;
  signature?: string;
  stamp?: string;
  requiresSignature: boolean;
}

export interface Mission {
  id: string;
  type: MissionType;
  destination: string;
  startDate: string;
  endDate: string;
  purpose: string;
  status: RequestStatus;
  currentStep: number;
  approvalSteps: ApprovalStep[];
  requester: User;
  department: string;
  school: string;
  createdAt: string;
  updatedAt: string;
}

export interface Leave {
  id: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: RequestStatus;
  currentStep: number;
  approvalSteps: ApprovalStep[];
  requester: User;
  department: string;
  school: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMissionRequest {
  type: MissionType;
  destination: string;
  startDate: string;
  endDate: string;
  purpose: string;
  department: string;
  school: string;
  district?: string;
  invitationFile?: File;
}

export interface CreateLeaveRequest {
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  department: string;
  school: string;
  otherType?: string;
  documentFile?: File;
}

export interface UpdateRequestStatus {
  id: string;
  status: RequestStatus;
  comment?: string;
  signature?: string;
}

export const APPROVAL_WORKFLOWS = {
  localMission: [
    { role: 'hod', requiresSignature: false },
    { role: 'dean', requiresSignature: false },
    { role: 'campus_admin', requiresSignature: true },
    { role: 'financial_manager', requiresSignature: false },
  ],
  internationalMission: [
    { role: 'hod', requiresSignature: false },
    { role: 'dean', requiresSignature: false },
    { role: 'campus_admin', requiresSignature: false },
    { role: 'financial_manager', requiresSignature: false },
    { role: 'principal', requiresSignature: false },
    { role: 'vice_chancellor', requiresSignature: true },
  ],
  leave: [
    { role: 'hod', requiresSignature: false },
    { role: 'dean', requiresSignature: false },
    { role: 'hr_manager', requiresSignature: true },
  ],
} as const; 