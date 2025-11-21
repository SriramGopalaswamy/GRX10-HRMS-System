import React, { useState, useRef, useEffect } from 'react';
import { generateHRResponse } from '../services/geminiService';
import { COMPANY_POLICIES } from '../constants';
import { Send, Bot, User, FileText, Download } from 'lucide-react';

interface PayslipAttachment {
  month: string;
  year: string;
  netPay: number;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  payslip?: PayslipAttachment;
}

export const PolicyChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your GRX10 HR Assistant. Ask me anything about company policies, leave rules, or benefits.",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleDownload = (payslip: PayslipAttachment) => {
    const htmlContent = `
      <html>
        <head>
          <title>Payslip - ${payslip.month} ${payslip.year}</title>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; background: #fff; }
            .header { border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
            .company { font-size: 28px; font-weight: bold; color: #4f46e5; }
            .title { font-size: 18px; color: #666; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .box { background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; }
            .box strong { display: block; margin-bottom: 10px; color: #111; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; padding: 12px; border-bottom: 2px solid #e5e7eb; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
            td { padding: 12px; border-bottom: 1px solid #f3f4f6; color: #374151; }
            .amount { text-align: right; font-family: monospace; font-size: 15px; }
            .deduction { color: #dc2626; }
            .total-row td { border-top: 2px solid #374151; font-weight: bold; font-size: 18px; color: #111; padding-top: 15px; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #9ca3af; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company">GRX10 Systems</div>
            <div class="title">Payslip for ${payslip.month} ${payslip.year}</div>
          </div>
          
          <div class="grid">
            <div class="box">
              <strong>Employee Details</strong>
              Name: Alice Carter<br/>
              ID: EMP001<br/>
              Dept: Human Resources<br/>
              Designation: HR Manager
            </div>
            <div class="box">
              <strong>Payment Details</strong>
              Bank: HDFC Bank<br/>
              Acct: XXXXXX1234<br/>
              Date: 30 ${payslip.month} ${payslip.year}<br/>
              Days Payable: 30
            </div>
          </div>

          <table>
            <tr><th>Description</th><th style="text-align:right">Amount (USD)</th></tr>
            <tr><td>Basic Salary</td><td class="amount">50,000.00</td></tr>
            <tr><td>House Rent Allowance (HRA)</td><td class="amount">20,000.00</td></tr>
            <tr><td>Special Allowances</td><td class="amount">15,000.00</td></tr>
            <tr><td><i>Less: Income Tax</i></td><td class="amount deduction">-2,500.00</td></tr>
            <tr><td><i>Less: Provident Fund</i></td><td class="amount deduction">-1,800.00</td></tr>
            <tr class="total-row">
              <td>NET PAYABLE</td>
              <td class="amount">$${payslip.netPay.toLocaleString()}.00</td>
            </tr>
          </table>
          
          <div class="footer">
            This is a computer-generated document. No signature is required.<br/>
            GRX10 Systems Pvt Ltd. | 123 Tech Park, Silicon Valley
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payslip_${payslip.month}_${payslip.year}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const aiResponse = await generateHRResponse(userMsg.text, COMPANY_POLICIES);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        sender: 'ai',
        timestamp: new Date(),
        payslip: aiResponse.payslip
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: Message = {
         id: (Date.now() + 1).toString(),
         text: "Sorry, something went wrong. Please try again.",
         sender: 'ai',
         timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-indigo-50 flex items-center gap-3">
        <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
          <Bot size={24} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">HR Assistant (Powered by Gemini)</h3>
          <p className="text-xs text-slate-500">Instant answers from company handbook</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'user' ? 'bg-slate-200' : 'bg-indigo-100 text-indigo-600'
              }`}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div>
                <div className={`p-3 rounded-2xl text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-100 text-slate-800 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                
                {/* Payslip Attachment Card */}
                {msg.payslip && (
                  <div className="mt-3 max-w-xs bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg">
                          <FileText size={16} />
                        </div>
                        <span className="text-sm font-medium text-slate-700">Payslip Generated</span>
                      </div>
                      <span className="text-xs font-mono text-slate-500">{msg.payslip.month} {msg.payslip.year}</span>
                    </div>
                    <div className="p-3 flex items-center justify-between gap-4">
                       <div>
                         <p className="text-xs text-slate-500">Net Pay</p>
                         <p className="text-lg font-bold text-slate-900">${msg.payslip.netPay.toLocaleString()}</p>
                       </div>
                       <button 
                        onClick={() => msg.payslip && handleDownload(msg.payslip)}
                        className="flex items-center gap-2 bg-indigo-600 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                       >
                         <Download size={14} />
                         PDF
                       </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="flex gap-3 max-w-[80%]">
               <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                 <Bot size={16} />
               </div>
               <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
               </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question here (e.g., 'Download my payslip for Oct 2023')"
          className="flex-1 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isTyping}
          className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};