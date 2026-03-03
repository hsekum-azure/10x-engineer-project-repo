import { useEffect, useRef } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Effect 1: Handle focus capture and restoration
  useEffect(() => {
    if (isOpen) {
      // CAPTURE the element that opened the modal
      previousFocusRef.current = document.activeElement;
      
      // Lock scrolling
      document.body.style.overflow = 'hidden';

      // Auto-focus the modal container
      const timer = setTimeout(() => {
        modalRef.current?.focus();
      }, 10);

      return () => {
        // RESTORE focus when modal closes or component unmounts
        // We use a small timeout to ensure the DOM has updated and the trigger is visible
        const restoreTimer = setTimeout(() => {
          previousFocusRef.current?.focus();
        }, 0);
        
        document.body.style.overflow = 'unset';
        clearTimeout(timer);
        // We don't clear restoreTimer here to ensure it fires
      };
    }
  }, [isOpen]);

  // Effect 2: Handle Escape key specifically
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      {/* Backdrop */}
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div 
        ref={modalRef}
        tabIndex="-1" 
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col max-h-[90vh] focus:outline-none"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors outline-none focus:ring-2 focus:ring-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}