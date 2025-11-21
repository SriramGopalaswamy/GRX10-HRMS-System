
export enum Role {
  EMPLOYEE = 'Employee',
  MANAGER = 'Manager',
  HR = 'HR',
  FINANCE = 'Finance',
  ADMIN = 'Admin'
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  designation: string;
  joinDate: string;
  avatar: string;
  managerId?: string;
  salary?: number; // Annual CTC
  status: 'Active' | 'Exited';
  password?: string; // Mock password for direct login
  isNewUser?: boolean;
}

export enum LeaveType {
  SICK = 'Sick Leave',
  CASUAL = 'Casual Leave',
  EARNED = 'Earned Leave',
  LOP = 'Loss of Pay'
}

export enum LeaveStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string; // HH:mm
  checkOut?: string; // HH:mm
  status: 'Present' | 'Absent' | 'Late' | 'Half Day';
  durationHours?: number;
}

export enum RegularizationType {
  MISSING_PUNCH = 'Missing Punch',
  INCORRECT_PUNCH = 'Incorrect Punch',
  WFH = 'Work From Home'
}

export interface RegularizationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  type: RegularizationType;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  newCheckIn?: string;
  newCheckOut?: string;
}

export interface Payslip {
  id: string;
  employeeId: string;
  month: string; // YYYY-MM
  basic: number;
  hra: number;
  allowances: number;
  deductions: number;
  netPay: number;
  generatedDate: string;
}

export interface Document {
  id: string;
  title: string;
  type: 'Policy' | 'Form' | 'Contract';
  url: string;
  lastUpdated: string;
}
