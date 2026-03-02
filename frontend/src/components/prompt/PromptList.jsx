import PromptCard from './PromptCard';
export default function PromptList({ prompts, onDelete, onEdit, onView }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {prompts.map((prompt) => (
        <PromptCard 
          key={prompt.id} 
          prompt={prompt} 
          onDelete={onDelete} 
          onEdit={onEdit} 
          onView={onView}
        />
      ))}
    </div>
  );
}