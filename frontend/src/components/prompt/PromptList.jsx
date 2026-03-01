import PromptCard from './PromptCard';

export default function PromptList({ prompts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {prompts.map(p => <PromptCard key={p.id} prompt={p} />)}
    </div>
  );
}