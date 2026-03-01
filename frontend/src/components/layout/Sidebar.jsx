export default function Sidebar({ onNavigate, activeView }) {
  const menuItems = [
    { id: 'prompts', name: 'All Prompts', icon: '📄' },
    { id: 'collections', name: 'Collections', icon: '📂' },
  ];

  return (
    <aside className="w-64 border-r border-gray-100 bg-gray-50 h-screen p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)} // This triggers the change!
            className={`w-full text-left px-3 py-2 rounded-md font-medium transition-all ${
              activeView === item.id 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'hover:bg-white text-gray-700'
            }`}
          >
            {item.icon} {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}