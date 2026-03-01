import { useState } from 'react';
import Layout from './components/layout/Layout';
import PromptList from './components/prompt/PromptList';
import SearchBar from './components/shared/SearchBar';
import Button from './components/shared/Button';
import Modal from './components/shared/Modal';
import PromptForm from './components/prompt/PromptForm';

// Mock Data matching your Python Pydantic Models
const MOCK_PROMPTS = [
  {
    id: "1",
    title: "Java Unit Test Generator",
    content: "Write a JUnit 5 test for the following class...",
    description: "Generates boilerplate for Spring Boot controllers.",
    tags: ["java", "testing", "spring-boot"],
    created_at: "2026-02-28T12:00:00"
  },
  {
    id: "2",
    title: "SQL Optimizer",
    content: "Explain the execution plan for this query...",
    description: "Helps identify missing indexes in PostgreSQL.",
    tags: ["sql", "database", "performance"],
    created_at: "2026-02-28T14:30:00"
  },
  {
    id: "3",
    title: "React Component Refactor",
    content: "Convert this class component to functional...",
    description: "Modernizes legacy React codebases.",
    tags: ["react", "frontend", "javascript"],
    created_at: "2026-02-28T15:00:00"
  }
];

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Simple search logic to demonstrate the SearchBar component
  const filteredPrompts = MOCK_PROMPTS.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Layout>
      {/* Header Section of the Main Content */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Prompts
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and organize your AI prompt library.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <SearchBar onSearch={setSearchQuery} />
          <Button onClick={() => setModalOpen(true)}>
            + Create
          </Button>
        </div>
      </div>

      {/* Main Prompt List Grid */}
      {filteredPrompts.length > 0 ? (
        <PromptList prompts={filteredPrompts} />
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-2xl">
          <p className="text-gray-400">No prompts found matching your search.</p>
        </div>
      )}

      {/* Shared Modal for creating a new Prompt */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        title="Create New Prompt"
      >
        <PromptForm />
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={() => alert("Connecting to Python Backend soon!")}>Save Prompt</Button>
        </div>
      </Modal>
    </Layout>
  );
}

export default App;