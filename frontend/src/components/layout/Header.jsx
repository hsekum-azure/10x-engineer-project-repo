export default function Header() {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
        <span className="bg-blue-600 text-white p-1 rounded">PL</span>
        <span>PromptLab</span>
      </div>
      <div className="flex gap-4">
        <button className="text-gray-600 hover:text-blue-600">Docs</button>
        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
      </div>
    </header>
  );
}