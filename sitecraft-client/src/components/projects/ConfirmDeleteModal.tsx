import { X, AlertTriangle } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  projectName: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export const ConfirmDeleteModal = ({
  isOpen,
  projectName,
  onClose,
  onConfirm,
  isDeleting = false,
}: ConfirmDeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111111] border border-white/10 rounded-[2.5rem] p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/10">
              <AlertTriangle className="text-red-500" size={24} />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              Delete Project
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-400 mb-2">
          Are you sure you want to delete <span className="text-white font-bold">"{projectName}"</span>?
        </p>
        <p className="text-sm text-red-400 mb-6">
          This action cannot be undone. All project data will be permanently deleted.
        </p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black rounded-xl transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl transition-all disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
