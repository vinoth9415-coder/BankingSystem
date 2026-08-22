import { FiAlertTriangle } from 'react-icons/fi';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, type = 'danger' }) {
  if (!isOpen) return null;

  const colors = {
    danger: { btn: 'bg-red-600 hover:bg-red-700', icon: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
    warning: { btn: 'bg-yellow-500 hover:bg-yellow-600', icon: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  };
  const c = colors[type];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-bounce-in">
        <div className={`flex items-center gap-3 p-3 rounded-xl mb-4 ${c.bg}`}>
          <FiAlertTriangle className={`text-2xl flex-shrink-0 ${c.icon}`} />
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">{title}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-white font-medium transition-all shadow-lg ${c.btn}`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
