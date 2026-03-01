export default function Button({ children, variant = 'primary', ...props }) {
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };

  return (
    <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${styles[variant]}`} {...props}>
      {children}
    </button>
  );
}