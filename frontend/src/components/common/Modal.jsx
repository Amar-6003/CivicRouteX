import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/70 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-500 hover:bg-teal-50 hover:text-teal-600"
        >
          <X size={20} />
        </button>

        <h2 className="mb-5 pr-8 text-xl font-bold text-slate-900">
          {title}
        </h2>

        {children}
      </div>
    </div>
  );
};

export default Modal;