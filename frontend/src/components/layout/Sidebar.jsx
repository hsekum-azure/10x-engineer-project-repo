export default function Sidebar({ onNavigate, activeView }) {
  const menuItems = [
    { id: 'prompts', name: 'Prompts', icon: '📄' },
    { id: 'collections', name: 'Collections', icon: '📂' },
  ];

  return (
    <nav className="flex md:flex-col p-2 md:p-4 gap-2 overflow-x-auto md:overflow-x-hidden">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex-1 md:flex-none ${
            activeView === item.id 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span>{item.icon}</span>
          <span>{item.name}</span>
        </button>
      ))}
    </nav>
  );
}