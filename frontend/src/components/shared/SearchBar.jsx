export default function SearchBar({ onSearch, value }) {
  return (
    <form 
      onSubmit={(e) => e.preventDefault()} 
      className="relative w-full max-w-md"
    >
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        🔍
      </span>
      <input 
        type="search" // 'search' type provides a 'clear' X in many browsers
        placeholder="Search prompts (matches title or content)..."
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        value={value}
        onChange={(e) => onSearch(e.target.value)}
      />
    </form>
  );
}