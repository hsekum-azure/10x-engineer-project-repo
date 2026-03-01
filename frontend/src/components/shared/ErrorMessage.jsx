export default function ErrorMessage({ message }) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
      <span>⚠️</span>
      <p className="font-medium">{message || "An unexpected error occurred."}</p>
    </div>
  );
}