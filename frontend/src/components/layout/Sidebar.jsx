export default function Sidebar() {
  const nav = ['All Prompts', 'Collections', 'Favorites', 'Tags'];
  return (
    <aside className="w-64 border-r border-gray-100 bg-gray-50 h-[calc(100vh-64px)] p-4 hidden md:block">
      <nav className="space-y-2">
        {nav.map(item => (
          <button key={item} className="w-full text-left px-3 py-2 rounded-md hover:bg-white hover:shadow-sm text-gray-700 font-medium transition-all">
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}