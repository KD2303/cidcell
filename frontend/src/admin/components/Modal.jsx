import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, footer, children, maxWidth = 'max-w-2xl' }) => {
  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className={`bg-[#0a0a0a] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[32px] w-full ${maxWidth} flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 shadow-glass`} 
        style={{ maxHeight: '92vh' }}
      >
        {/* Header */}
        <div className="flex-none p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white uppercase tracking-widest">{title}</h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 text-white scroll-smooth">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex-none p-6 border-t border-white/5 bg-white/[0.02] flex justify-end gap-4 z-10 font-bold uppercase text-xs">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
