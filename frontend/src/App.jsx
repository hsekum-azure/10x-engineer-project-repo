import { useEffect, useState, useMemo } from 'react';
import Layout from './components/layout/Layout';
import PromptList from './components/prompt/PromptList';
import PromptDetail from './components/prompt/PromptDetail';
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
  const [view, setView] = useState('prompts'); 
  const [prompts, setPrompts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  
  // Filtering States
  const [activeCollection, setActiveCollection] = useState("");
  const [activeTags, setActiveTags] = useState([]); // Array for multi-select

  // --- Derived Data: Unique Tags ---
  const allAvailableTags = useMemo(() => {
    const tags = new Set();
    prompts.forEach(p => p.tags?.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [prompts]);

  // --- Data Loading ---
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
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

  const fetchFilteredPrompts = (search = searchQuery, colId = activeCollection, tagsArr = activeTags) => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (colId) params.collection_id = colId;
    if (tagsArr.length > 0) params.tags = tagsArr.join(',');

    promptApi.getPrompts(params)
      .then(data => {
        setPrompts(data.prompts);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  };

  // --- Handlers ---
  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchFilteredPrompts(query, activeCollection, activeTags);
  };

  const handleCollectionFilter = (id) => {
    setActiveCollection(id);
    fetchFilteredPrompts(searchQuery, id, activeTags);
  };

  const handleTagToggle = (tag) => {
    const newTags = activeTags.includes(tag)
      ? activeTags.filter(t => t !== tag)
      : [...activeTags, tag];
    setActiveTags(newTags);
    fetchFilteredPrompts(searchQuery, activeCollection, newTags);
  };

  const handleResetFilters = () => {
    setActiveCollection("");
    setActiveTags([]);
    setSearchQuery("");
    fetchFilteredPrompts("", "", []);
  };

  const handleDeletePrompt = async (id) => {
    if (window.confirm("Are you sure you want to delete this prompt?")) {
      try {
        await promptApi.deletePrompt(id);
        loadAllData();
      } catch (err) {
        alert("Error deleting: " + err);
      }
    }
  };

  const handleDeleteCollection = async (id) => {
    if (window.confirm("Delete this collection? This will also remove all prompts inside it.")) {
      try {
        await collectionApi.deleteCollection(id);
        loadAllData(); 
      } catch (err) {
        alert("Error: " + err);
      }
    }
  };

  const handleEditClick = (prompt) => {
    setEditingPrompt(prompt);
    setModalOpen(true);
  };

  const handleEditCollectionClick = (collection) => {
    setEditingCollection(collection);
    setModalOpen(true);
  };

  const handleViewPrompt = (prompt) => {
    setSelectedPrompt(prompt);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingPrompt(null);
    setEditingCollection(null);
    setSelectedPrompt(null);
  };

  const handleRefresh = () => {
    handleCloseModal();
    loadAllData();
  };

  // --- Content Renderer ---
  const renderContent = () => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    if (view === 'prompts') {
      return prompts.length > 0 ? (
        <PromptList 
          prompts={prompts} 
          onDelete={handleDeletePrompt} 
          onEdit={handleEditClick} 
          onView={handleViewPrompt}
        />
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-2xl">
          <p className="text-gray-400">No prompts match your filters.</p>
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
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight capitalize">{view}</h1>
          <p className="text-gray-500 mt-1">Manage and organize your AI library.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {view === 'prompts' && <SearchBar onSearch={handleSearch} />}
          <Button onClick={() => setModalOpen(true)}>
            + Create {view === 'prompts' ? 'Prompt' : 'Collection'}
          </Button>
        </div>
      </div>

      {/* 2. Filter Bar (Contextual) */}
      {view === 'prompts' && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-6">
            
            {/* Collection Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Collection</span>
              <select 
                value={activeCollection}
                onChange={(e) => handleCollectionFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Collections</option>
                {collections.map(col => (
                  <option key={col.id} value={col.id}>{col.name}</option>
                ))}
              </select>
            </div>

            {/* Tags Toggle Cloud */}
            <div className="flex-1 flex items-center gap-3 overflow-hidden">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tags</span>
              <div className="flex flex-wrap gap-2">
                {allAvailableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      activeTags.includes(tag)
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            {(activeCollection || activeTags.length > 0 || searchQuery) && (
              <button 
                onClick={handleResetFilters}
                className="text-xs font-bold text-red-500 hover:underline px-2"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Main Content */}
      {renderContent()}

      {/* 4. Shared Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={
          selectedPrompt ? "Prompt Details" : 
          editingPrompt ? "Edit Prompt" : 
          editingCollection ? "Edit Collection" :
          (view === 'prompts' ? "Create New Prompt" : "Create New Collection")
        }
      >
        {selectedPrompt ? (
          <PromptDetail 
            prompt={selectedPrompt} 
            collections={collections}
            onEdit={(p) => { setSelectedPrompt(null); handleEditClick(p); }}
            onDelete={(id) => { handleCloseModal(); handleDeletePrompt(id); }}
          />
        ) : view === 'prompts' ? (
          <PromptForm onSave={handleRefresh} collections={collections} initialData={editingPrompt} />
        ) : (
          <CollectionForm onSave={handleRefresh} initialData={editingCollection} />
        )}
      </Modal>
    </Layout>
  );
}

export default App;