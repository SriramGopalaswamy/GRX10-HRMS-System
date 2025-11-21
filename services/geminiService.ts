import { GoogleGenAI, Type } from "@google/genai";
import { Employee, Role, RegularizationRequest, LeaveStatus } from '../types';
import { MOCK_REGULARIZATIONS } from '../constants';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Define tools for the HR Assistant
const tools = [
  {
    functionDeclarations: [
      {
        name: "generatePayslip",
        description: "Generates and retrieves the salary slip (payslip) PDF for a specific month and year.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            month: { type: Type.STRING, description: "The month name (e.g. January, October)" },
            year: { type: Type.STRING, description: "The year (e.g. 2023)" }
          },
          required: ["month", "year"]
        }
      },
      {
        name: "openRegularizationForm",
        description: "Opens a UI form for the user to submit a regularization request (missing punch, incorrect punch, WFH). Use this when the user wants to regularize but hasn't provided all details.",
        parameters: { type: Type.OBJECT, properties: {} }
      },
      {
        name: "getMyRegularizationRequests",
        description: "Retrieves the history and status of regularization requests for the current user.",
        parameters: { type: Type.OBJECT, properties: {} }
      },
      {
        name: "getPendingApprovals",
        description: "Retrieves pending regularization requests that need approval. Only for Managers and HR.",
        parameters: { type: Type.OBJECT, properties: {} }
      },
      {
        name: "approveRejectRequest",
        description: "Approve or reject a specific regularization request.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            requestId: { type: Type.STRING },
            decision: { type: Type.STRING, enum: ["Approved", "Rejected"] }
          },
          required: ["requestId", "decision"]
        }
      }
    ]
  }
];

export interface HRResponse {
  text: string;
  payslip?: {
    month: string;
    year: string;
    netPay: number;
  };
  showRegularizationForm?: boolean;
  regularizationList?: RegularizationRequest[];
  isApprovalList?: boolean;
}

export const generateHRResponse = async (query: string, context: string, user: Employee): Promise<HRResponse> => {
  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are an helpful HR Assistant for GRX10 Company. 
    Current User: ${user.name} (${user.role}).
    
    Use the provided context (Company Policies) to answer employee questions accurately.
    
    TOOL USAGE RULES:
    1. Payslips: If user asks for payslip/salary slip, use 'generatePayslip'.
    2. Regularization: 
       - If user says "I missed a punch" or "apply for regularization" without details, use 'openRegularizationForm'.
       - If user asks "status of my requests", use 'getMyRegularizationRequests'.
       - If Manager/HR asks "pending approvals", use 'getPendingApprovals'.
       - If Manager/HR says "Approve request REG...", use 'approveRejectRequest'.
    
    Be professional and concise.`;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: `Context: ${context}\n\nQuestion: ${query}`,
      config: {
        systemInstruction: systemInstruction,
        tools: tools,
      }
    });

    // Check for function calls
    const functionCall = response.candidates?.[0]?.content?.parts?.find(p => p.functionCall)?.functionCall;

    if (functionCall) {
      const args = functionCall.args as any;
      
      if (functionCall.name === 'generatePayslip') {
        return {
          text: `I've generated your payslip for ${args.month} ${args.year}. You can download it directly below.`,
          payslip: {
            month: args.month,
            year: args.year,
            netPay: 85000 // Mock net pay amount
          }
        };
      }

      if (functionCall.name === 'openRegularizationForm') {
        return {
          text: "I can help with that. Please fill out the details in the form below to submit your request.",
          showRegularizationForm: true
        };
      }

      if (functionCall.name === 'getMyRegularizationRequests') {
        // Filter requests for current user
        const myRequests = MOCK_REGULARIZATIONS.filter(r => r.employeeId === user.id);
        return {
          text: myRequests.length ? "Here are your recent regularization requests:" : "You have no regularization requests.",
          regularizationList: myRequests
        };
      }

      if (functionCall.name === 'getPendingApprovals') {
        if (user.role === Role.EMPLOYEE) {
          return { text: "Sorry, only Managers and HR can view pending approvals." };
        }
        // Filter pending requests (mocking manager view logic)
        const pending = MOCK_REGULARIZATIONS.filter(r => r.status === LeaveStatus.PENDING && r.employeeId !== user.id);
        return {
          text: pending.length ? "Here are the requests pending your approval:" : "No pending approvals found.",
          regularizationList: pending,
          isApprovalList: true
        };
      }

      if (functionCall.name === 'approveRejectRequest') {
        return {
          text: `Request ${args.requestId} has been ${args.decision.toLowerCase()}. (System updated)`,
          // In a real app, we would update the DB here.
        };
      }
    }

    return { text: response.text || "I'm sorry, I couldn't process that request right now." };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Sorry, the HR Assistant is temporarily unavailable." };
  }
};

export const generateJobDescription = async (role: string, department: string, skills: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a professional Job Description for a ${role} in the ${department} department at GRX10. 
      Required skills: ${skills}. 
      Include Responsibilities, Requirements, and a section on "Why Join GRX10?". Output in Markdown format.`,
    });
    return response.text || "Failed to generate JD.";
  } catch (error) {
    console.error("Gemini JD Gen Error:", error);
    return "Error generating description.";
  }
};