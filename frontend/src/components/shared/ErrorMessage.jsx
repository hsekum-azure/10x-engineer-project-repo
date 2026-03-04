export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-red-50 rounded-2xl border border-red-100">
      <div className="text-4xl mb-4">🔌</div>
      <h3 className="text-lg font-bold text-red-900 mb-2">Connection Issue</h3>
      <p className="text-red-700 max-w-xs mb-6">
        {message || "We're having trouble reaching the database right now."}
      </p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
        >
          Try Reconnecting
        </button>
      )}
    </div>
  );
}