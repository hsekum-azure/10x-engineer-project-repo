import { useEffect, useState } from 'react';
import Layout from './components/layout/Layout';
import PromptList from './components/prompt/PromptList';
import CollectionList from './components/collection/CollectionList';
import CollectionForm from './components/collection/CollectionForm';
import SearchBar from './components/shared/SearchBar';
import Button from './components/shared/Button';
import Modal from './components/shared/Modal';
import PromptForm from './components/prompt/PromptForm';
import LoadingSpinner from './components/shared/LoadingSpinner';
import ErrorMessage from './components/shared/ErrorMessage';
import { promptApi } from './api/prompts'; 
import { collectionApi } from './api/collections';

function App() {
  // --- State Management ---
  const [view, setView] = useState('prompts'); // Navigation state: 'prompts' | 'collections'
  const [prompts, setPrompts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);


  // --- Data Loading ---
  useEffect(() => {
    loadAllData();
  }, []);

  const handleDeleteCollection = async (id) => {
    if (window.confirm("Delete this collection? This will also remove all prompts inside it (as per your backend logic).")) {
      try {
        await collectionApi.deleteCollection(id);
        loadAllData(); 
      } catch (err) {
        alert("Error: " + err);
      }
    }
  };

  const handleEditCollectionClick = (collection) => {
    setEditingCollection(collection);
    setModalOpen(true);
  };

  const handleDeletePrompt = async (id) => {
    if (window.confirm("Are you sure you want to delete this prompt?")) {
      try {
        await promptApi.deletePrompt(id);
        loadAllData(); // Refresh list
      } catch (err) {
        alert("Error deleting: " + err);
      }
    }
  };

  const handleEditClick = (prompt) => {
    setEditingPrompt(prompt);
    setModalOpen(true);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Fetch both simultaneously for a faster UI load
      const [pData, cData] = await Promise.all([
        promptApi.getPrompts(),
        collectionApi.getCollections()
      ]);
      setPrompts(pData.prompts);
      setCollections(cData.collections);
      setError(null);
    } catch (err) {
      console.error("API Error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---
  const handleSearch = (query) => {
    setSearchQuery(query);
    setLoading(true);
    // API-side filtering
    promptApi.getPrompts({ search: query })
      .then(data => {
        setPrompts(data.prompts);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  };

  // Triggered after a successful POST in either form
  const handleRefresh = () => {
    setModalOpen(false);
    setEditingPrompt(null);
    setEditingCollection(null);
    loadAllData();
  };

  // --- UI Logic Helpers ---
  const renderContent = () => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    if (view === 'prompts') {
      return prompts.length > 0 ? (
        <PromptList 
          prompts={prompts} 
          onDelete={handleDeletePrompt} 
          onEdit={handleEditClick} 
        />
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-2xl">
          <p className="text-gray-400">No prompts found in your library.</p>
        </div>
      );
    }

    if (view === 'collections') {
      return collections.length > 0 ? (
        <CollectionList 
          collections={collections} 
          onDelete={handleDeleteCollection} 
          onEdit={handleEditCollectionClick} 
        />
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-2xl">
          <p className="text-gray-400">No collections created yet.</p>
        </div>
      );
    }
  };

  return (
    <Layout onNavigate={setView} activeView={view}>
      {/* Dynamic Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight capitalize">
            {view}
          </h1>
          <p className="text-gray-500 mt-1">
            {view === 'prompts' 
              ? 'Manage and search your AI prompt library.' 
              : 'Organize your prompts into logical groups.'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {view === 'prompts' && <SearchBar onSearch={handleSearch} />}
          <Button onClick={() => setModalOpen(true)}>
            + Create {view === 'prompts' ? 'Prompt' : 'Collection'}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {renderContent()}

      {/* Shared Modal Logic */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setModalOpen(false);
          setEditingPrompt(null);
        }} 
        title={editingPrompt ? "Edit Prompt" : (view === 'prompts' ? "Create New Prompt" : "Create New Collection")}
      >
        {view === 'prompts' ? (
          <PromptForm 
            onSave={handleRefresh} 
            collections={collections} 
            initialData={editingPrompt} // Pass this!
          />
        ) : (
          <CollectionForm onSave={handleRefresh} initialData={editingCollection} />
        )}
      </Modal>
    </Layout>
  );
}

export default App;