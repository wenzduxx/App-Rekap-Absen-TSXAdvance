import React from 'react';
import { X, Download, CheckCircle2, Clock, AlertCircle, FileText, CreditCard, Calendar } from 'lucide-react';
import { StudentProfile } from '../types';

interface TuitionHistoryModalProps {
  student: StudentProfile;
  onClose: () => void;
}

// Mock Data Structure (Ready for Backend Integration)
interface PaymentRecord {
  id: string;
  academicYear: string;
  semester: string; // 'Ganjil' | 'Genap'
  invoiceDate: string;
  dueDate: string;
  paymentDate?: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Pending' | 'Overdue';
  method?: string; // e.g., 'Virtual Account', 'Credit Card'
  refNumber?: string;
  invoiceUrl?: string; // URL to the invoice file
}

export const TuitionHistoryModal: React.FC<TuitionHistoryModalProps> = ({ student, onClose }) => {
  // In a real app, fetch this data using student.id
  // This mock data simulates a database response
  const paymentHistory: PaymentRecord[] = [
    {
      id: 'INV-2023-001',
      academicYear: '2023/2024',
      semester: 'Ganjil',
      invoiceDate: '2023-08-01',
      dueDate: '2023-08-20',
      paymentDate: student.tuitionStatus === 'Paid' ? student.tuitionDate : undefined,
      amount: 5500000,
      status: student.tuitionStatus === 'Paid' ? 'Paid' : (student.tuitionStatus === 'Pending' ? 'Pending' : 'Unpaid'),
      method: student.tuitionStatus === 'Paid' ? 'BCA Virtual Account' : undefined,
      refNumber: student.tuitionStatus === 'Paid' ? 'BCA-77218392' : undefined,
      invoiceUrl: student.tuitionInvoiceUrl, // Use the uploaded invoice for the latest record
    },
    {
      id: 'INV-2022-002',
      academicYear: '2022/2023',
      semester: 'Genap',
      invoiceDate: '2023-02-01',
      dueDate: '2023-02-20',
      paymentDate: '2023-02-15',
      amount: 5500000,
      status: 'Paid',
      method: 'Mandiri Virtual Account',
      refNumber: 'MDR-9928312',
    },
    {
      id: 'INV-2022-001',
      academicYear: '2022/2023',
      semester: 'Ganjil',
      invoiceDate: '2022-08-01',
      dueDate: '2022-08-20',
      paymentDate: '2022-08-18',
      amount: 5250000,
      status: 'Paid',
      method: 'BCA Virtual Account',
      refNumber: 'BCA-1129381',
    }
  ];

  // Helper for currency formatting
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  // Helper for status styling
  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Unpaid': return 'bg-red-50 text-red-700 border-red-200';
      case 'Overdue': return 'bg-red-100 text-red-800 border-red-200 font-bold';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Paid': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'Pending': return <Clock className="w-3.5 h-3.5" />;
      default: return <AlertCircle className="w-3.5 h-3.5" />;
    }
  };

  const handleDownload = (url?: string) => {
      if (url) {
          window.open(url, '_blank');
      } else {
          alert("Invoice file not available for download.");
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-100 text-primary rounded-lg">
                <CreditCard className="w-5 h-5" />
             </div>
             <div>
                <h2 className="text-lg font-bold text-slate-900">Tuition Payment History</h2>
                <p className="text-xs text-slate-500">History pembayaran SPP & Biaya Akademik</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto bg-[#F8FAFC]">
            
            {/* Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Paid (All Time)</p>
                        <h3 className="text-2xl font-bold text-slate-900">
                            {formatIDR(paymentHistory.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0))}
                        </h3>
                    </div>
                    <div className="absolute right-0 top-0 w-24 h-full bg-emerald-50 -skew-x-12 translate-x-8"></div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                     <div className="relative z-10">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Upcoming / Pending</p>
                        <h3 className="text-2xl font-bold text-slate-900">
                            {formatIDR(paymentHistory.filter(p => p.status !== 'Paid').reduce((sum, p) => sum + p.amount, 0))}
                        </h3>
                     </div>
                     <div className="absolute right-0 top-0 w-24 h-full bg-blue-50 -skew-x-12 translate-x-8"></div>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {paymentHistory.map((record) => (
                    <div key={record.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row">
                            {/* Left: Info */}
                            <div className="flex-1 p-5 border-b md:border-b-0 md:border-r border-slate-100">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-900">{record.semester} {record.academicYear}</span>
                                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${getStatusStyle(record.status)}`}>
                                            {getStatusIcon(record.status)} {record.status}
                                        </span>
                                    </div>
                                    <span className="text-xs font-mono text-slate-400">#{record.id}</span>
                                </div>
                                <div className="flex items-center gap-6 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-xs">Inv: {record.invoiceDate}</span>
                                    </div>
                                    {record.paymentDate && (
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                            <span className="text-xs">Paid: <span className="font-semibold text-slate-800">{record.paymentDate}</span></span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Amount & Action */}
                            <div className="w-full md:w-48 bg-slate-50 p-5 flex flex-col justify-center items-end gap-2">
                                <span className="text-lg font-bold text-slate-900">{formatIDR(record.amount)}</span>
                                {record.status === 'Paid' ? (
                                    <button 
                                        onClick={() => handleDownload(record.invoiceUrl)}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-blue-700 transition-colors"
                                        title="Download Payment Proof"
                                    >
                                        <Download className="w-3.5 h-3.5" /> Receipt
                                    </button>
                                ) : (
                                    <button className="w-full py-1.5 bg-primary hover:bg-blue-600 text-white text-xs font-bold rounded shadow-sm transition-colors">
                                        Pay Now
                                    </button>
                                )}
                            </div>
                        </div>
                        {record.method && (
                             <div className="px-5 py-2 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500 flex justify-between items-center">
                                <span>Method: <span className="font-medium text-slate-700">{record.method}</span></span>
                                <span>Ref: <span className="font-mono">{record.refNumber}</span></span>
                             </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end">
            <button 
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
            >
                Close Window
            </button>
        </div>
      </div>
    </div>
  );
};