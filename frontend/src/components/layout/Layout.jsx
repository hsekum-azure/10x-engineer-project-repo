import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout({ children, onNavigate, activeView }) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Pass the props here! */}
        <Sidebar onNavigate={onNavigate} activeView={activeView} />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}