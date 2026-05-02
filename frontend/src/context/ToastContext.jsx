import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = ++idCounter;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`
              flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold
              animate-[slideDown_0.3s_ease-out]
              ${t.type === 'wishlist'
                ? 'bg-pink-50 text-pink-700 border border-pink-200'
                : t.type === 'remove'
                  ? 'bg-gray-50 text-gray-600 border border-gray-200'
                  : 'bg-white text-gray-800 border border-[#e8dfc8]'}
            `}
          >
            {t.type === 'wishlist' ? '❤️' : t.type === 'remove' ? '💔' : '🛒'}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
