import { GoogleGenAI, Type } from "@google/genai";

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
      }
    ]
  }
];

interface HRResponse {
  text: string;
  payslip?: {
    month: string;
    year: string;
    netPay: number;
  };
}

export const generateHRResponse = async (query: string, context: string): Promise<HRResponse> => {
  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are an helpful HR Assistant for GRX10 Company. 
    Use the provided context (Company Policies) to answer employee questions accurately. 
    Be professional, concise, and empathetic. 
    
    CRITICAL TOOL USAGE:
    If the user asks for a "payslip", "salary slip", "pay stub", or "salary statement", you MUST use the 'generatePayslip' tool.
    Do not just say you can generate it, actually call the tool.
    If the month/year is not specified in the user's request, ask the user for it first before calling the tool.
    
    If the answer to a policy question isn't in the context, advise them to contact HR directly.`;
    
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

    if (functionCall && functionCall.name === 'generatePayslip') {
      const args = functionCall.args as any;
      // In a real app, this would call a backend API to generate the PDF
      return {
        text: `I've generated your payslip for ${args.month} ${args.year}. You can download it directly from the chat below.`,
        payslip: {
          month: args.month,
          year: args.year,
          netPay: 85000 // Mock net pay amount
        }
      };
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