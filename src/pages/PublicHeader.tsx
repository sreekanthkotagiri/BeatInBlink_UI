// src/components/ui/PublicHeader.tsx
const PublicHeader = () => (
  <header className="bg-white border-b shadow-sm py-4 px-6 sticky top-0 z-20">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-extrabold text-blue-700 tracking-tight">
        <span className="text-yellow-500">BeatInBlink</span>
      </h1>
      <span className="text-sm italic text-gray-500">Faster. Smarter. In a blink.</span>
    </div>
  </header>
);

export default PublicHeader;
