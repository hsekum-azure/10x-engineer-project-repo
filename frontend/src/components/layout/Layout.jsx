import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout({ children, onNavigate, activeView }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      {/* Mobile-responsive container */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        
        {/* Sidebar: Top-scroll on mobile, Side-fix on Desktop */}
        <div className="w-full md:w-64 border-b md:border-r border-gray-200 bg-white">
          <Sidebar onNavigate={onNavigate} activeView={activeView} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}