import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', type = 'warning', maxWidthClass = 'max-w-sm' }) => {
    if (!isOpen) return null;

    const isDanger = type === 'danger';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in">
            <div className={`bg-white rounded-2xl shadow-xl border border-slate-100 w-full ${maxWidthClass} overflow-hidden animate-in zoom-in-95 duration-200`}>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDanger ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-500'}`}>
                            <AlertCircle size={24} />
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-50 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{message}</p>
                </div>
                
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => { onConfirm(); onClose(); }}
                        className={`px-4 py-2 font-semibold text-white rounded-lg transition-colors shadow-sm text-sm ${isDanger ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' : 'bg-[#004AAD] hover:bg-blue-800 shadow-blue-200'}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const AlertModal = ({ isOpen, onClose, title, message, type = 'info' }) => {
    if (!isOpen) return null;

    const config = {
        success: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        error: { icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' },
        info: { icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' }
    };
    const c = config[type] || config.info;
    const Icon = c.icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in">
            <div className={`bg-white rounded-2xl shadow-xl border ${c.border} w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200`}>
                <div className="p-6 text-center">
                    <div className={`w-16 h-16 ${c.bg} ${c.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <Icon size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">{message}</p>
                    
                    <button 
                        onClick={onClose}
                        className={`w-full py-3 font-bold text-white rounded-xl transition-all shadow-sm ${type === 'error' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' : type === 'success' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-[#004AAD] hover:bg-blue-800 shadow-blue-200'}`}
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
};

export const AIUploadModal = ({ isOpen, onClose, onUpload }) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                            </span>
                            AI OCR Document Scanner
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 font-medium">Upload PDF/DOCX to magically extract questions</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                        <X size={18} />
                    </button>
                </div>
                
                <div className="p-8 pb-12">
                    <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-colors hover:bg-indigo-50/60 cursor-pointer group">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-indigo-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mb-1">Drag & Drop your document here</h4>
                        <p className="text-sm text-slate-500 mb-6">Supports .PDF and .DOCX format up to 5MB</p>
                        
                        <input type="file" className="hidden" id="ai-file-upload" accept=".pdf,.docx" onChange={(e) => onUpload(e.target.files[0])} />
                        <label htmlFor="ai-file-upload" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 cursor-pointer transition-colors">
                            Browse Files
                        </label>
                    </div>
                    
                    <div className="mt-8 bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3">
                        <AlertCircle size={20} className="text-amber-500 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-amber-800">Beta Feature Notice</p>
                            <p className="text-xs text-amber-700 mt-1 leading-relaxed">The AI OCR engine will automatically detect question patterns (MCQs, Fill in Blanks, True/False) and populate your editor. Please review the extracted questions manually before publishing the exam.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
