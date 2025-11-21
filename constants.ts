
import { Employee, Role, LeaveRequest, LeaveType, LeaveStatus, AttendanceRecord, RegularizationRequest, RegularizationType } from './types';

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'EMP001',
    name: 'Alice Carter',
    email: 'alice@grx10.com',
    role: Role.HR,
    department: 'Human Resources',
    designation: 'HR Manager',
    joinDate: '2022-01-15',
    avatar: 'https://picsum.photos/200',
    salary: 85000,
    status: 'Active',
    password: 'password123',
    isNewUser: false
  },
  {
    id: 'EMP002',
    name: 'Bob Smith',
    email: 'bob@grx10.com',
    role: Role.MANAGER,
    department: 'Engineering',
    designation: 'Tech Lead',
    joinDate: '2021-05-20',
    avatar: 'https://picsum.photos/201',
    salary: 120000,
    status: 'Active',
    password: 'password123',
    isNewUser: false
  },
  {
    id: 'EMP003',
    name: 'Charlie Davis',
    email: 'charlie@grx10.com',
    role: Role.EMPLOYEE,
    department: 'Engineering',
    designation: 'Frontend Engineer',
    joinDate: '2023-02-10',
    managerId: 'EMP002',
    avatar: 'https://picsum.photos/202',
    salary: 90000,
    status: 'Active',
    password: 'password123',
    isNewUser: false
  },
  {
    id: 'EMP004',
    name: 'Diana Evans',
    email: 'diana@grx10.com',
    role: Role.FINANCE,
    department: 'Finance',
    designation: 'Payroll Specialist',
    joinDate: '2022-08-01',
    avatar: 'https://picsum.photos/203',
    salary: 75000,
    status: 'Active',
    password: 'password123',
    isNewUser: false
  },
  {
    id: 'EMP005',
    name: 'Ethan Hunt',
    email: 'ethan@grx10.com',
    role: Role.EMPLOYEE,
    department: 'Sales',
    designation: 'Sales Executive',
    joinDate: '2023-06-15',
    avatar: 'https://picsum.photos/204',
    salary: 60000,
    status: 'Active',
    password: 'password123',
    isNewUser: false
  }
];

export const MOCK_LEAVES: LeaveRequest[] = [
  {
    id: 'L001',
    employeeId: 'EMP003',
    type: LeaveType.SICK,
    startDate: '2023-10-10',
    endDate: '2023-10-11',
    reason: 'Viral Fever',
    status: LeaveStatus.APPROVED,
    appliedOn: '2023-10-09'
  },
  {
    id: 'L002',
    employeeId: 'EMP003',
    type: LeaveType.CASUAL,
    startDate: '2023-11-05',
    endDate: '2023-11-05',
    reason: 'Personal work',
    status: LeaveStatus.PENDING,
    appliedOn: '2023-11-01'
  }
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'A001',
    employeeId: 'EMP003',
    date: '2023-10-25',
    checkIn: '09:05',
    checkOut: '18:10',
    status: 'Present',
    durationHours: 9.1
  },
  {
    id: 'A002',
    employeeId: 'EMP003',
    date: '2023-10-26',
    checkIn: '09:30',
    checkOut: '18:00',
    status: 'Late',
    durationHours: 8.5
  }
];

export const MOCK_REGULARIZATIONS: RegularizationRequest[] = [
  {
    id: 'REG001',
    employeeId: 'EMP003',
    employeeName: 'Charlie Davis',
    date: '2023-10-26',
    type: RegularizationType.MISSING_PUNCH,
    reason: 'Forgot to punch out',
    status: LeaveStatus.PENDING,
    appliedOn: '2023-10-27',
    newCheckIn: '09:30',
    newCheckOut: '18:30'
  },
  {
    id: 'REG002',
    employeeId: 'EMP003',
    employeeName: 'Charlie Davis',
    date: '2023-10-20',
    type: RegularizationType.WFH,
    reason: 'Car breakdown, worked from home',
    status: LeaveStatus.APPROVED,
    appliedOn: '2023-10-20'
  },
  {
    id: 'REG003',
    employeeId: 'EMP005',
    employeeName: 'Ethan Hunt',
    date: '2023-10-28',
    type: RegularizationType.INCORRECT_PUNCH,
    reason: 'Biometric system error',
    status: LeaveStatus.PENDING,
    appliedOn: '2023-10-29',
    newCheckIn: '09:00',
    newCheckOut: '18:00'
  }
];

export const COMPANY_POLICIES = `
  GRX10 Employee Handbook Summary:
  1. Working Hours: 9:00 AM to 6:00 PM. Grace period 15 mins.
  2. Leave Policy: 12 Casual Leaves, 12 Sick Leaves, 15 Earned Leaves per year.
  3. Remote Work: Allowed 2 days per week with Manager approval.
  4. Probation: 3 months for all new joinees.
  5. Insurance: Comprehensive health coverage for employee + 2 dependents.
  6. Payroll: Disbursed on the last working day of the month.
  7. Data Security: Access cards must be worn at all times. No sharing of credentials.
`;
