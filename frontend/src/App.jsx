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
import ConfirmDialog from './components/shared/ConfirmDialog'; 
import { promptApi } from './api/prompts'; 
import { collectionApi } from './api/collections';

function App() {
  const [view, setView] = useState('prompts'); 
  const [prompts, setPrompts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // This state drives the highlight
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  
  const [activeCollection, setActiveCollection] = useState("");
  const [activeTags, setActiveTags] = useState([]); 

  const [confirmDelete, setConfirmDelete] = useState({ 
    isOpen: false, type: null, id: null, title: '' 
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const allAvailableTags = useMemo(() => {
    const tags = new Set();
    prompts.forEach(p => p.tags?.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [prompts]);

  useEffect(() => { loadAllData(); }, []);

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

  const handleSearch = (query) => {
    setSearchQuery(query); // Update state for the UI
    fetchFilteredPrompts(query, activeCollection, activeTags); // Filter data
  };

  const handleCollectionFilter = (id) => {
    setActiveCollection(id);
    fetchFilteredPrompts(searchQuery, id, activeTags);
  };

  const handleTagToggle = (tag) => {
    const newTags = activeTags.includes(tag) ? activeTags.filter(t => t !== tag) : [...activeTags, tag];
    setActiveTags(newTags);
    fetchFilteredPrompts(searchQuery, activeCollection, newTags);
  };

  const handleResetFilters = () => {
    setActiveCollection("");
    setActiveTags([]);
    setSearchQuery("");
    fetchFilteredPrompts("", "", []);
  };

  const handleDeletePrompt = (id) => {
    const prompt = prompts.find(p => p.id === id);
    setConfirmDelete({ isOpen: true, type: 'prompt', id, title: prompt?.title || 'this prompt' });
  };

  const handleDeleteCollection = (id) => {
    const col = collections.find(c => c.id === id);
    setConfirmDelete({ isOpen: true, type: 'collection', id, title: col?.name || 'this collection' });
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    try {
      if (confirmDelete.type === 'prompt') await promptApi.deletePrompt(confirmDelete.id);
      else await collectionApi.deleteCollection(confirmDelete.id);
      setConfirmDelete({ isOpen: false, type: null, id: null, title: '' });
      loadAllData();
      if (selectedPrompt) setSelectedPrompt(null);
    } catch (err) {
      alert("Delete failed: " + err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (prompt) => { setEditingPrompt(prompt); setModalOpen(true); };
  const handleEditCollectionClick = (collection) => { setEditingCollection(collection); setModalOpen(true); };
  const handleViewPrompt = (prompt) => { setSelectedPrompt(prompt); setModalOpen(true); };
  const handleCloseModal = () => { setModalOpen(false); setEditingPrompt(null); setEditingCollection(null); setSelectedPrompt(null); };
  const handleRefresh = () => { handleCloseModal(); loadAllData(); };

  const renderContent = () => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    if (view === 'prompts') {
      if (prompts.length > 0) {
        return (
          <PromptList 
            prompts={prompts} 
            collections={collections} 
            searchQuery={searchQuery}
            onDelete={handleDeletePrompt} 
            onEdit={handleEditClick} 
            onView={handleViewPrompt}
          />
        );
      }
      return (
        <div className="text-center py-20 bg-white border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center">
          <div className="text-4xl mb-3">✍️</div>
          <p className="text-gray-500 font-medium mb-4">No prompts found.</p>
          <Button onClick={() => setModalOpen(true)}>+ Create First Prompt</Button>
        </div>
      );
    }

    if (view === 'collections') {
      // 1. Calculate how many prompts are in each collection
      const promptCounts = prompts.reduce((acc, prompt) => {
        if (prompt.collection_id) {
          acc[prompt.collection_id] = (acc[prompt.collection_id] || 0) + 1;
        }
        return acc;
      }, {});

      if (collections.length > 0) {
        return (
          <CollectionList 
            collections={collections} 
            promptCounts={promptCounts} // 2. Pass counts to the list
            onDelete={handleDeleteCollection} 
            onEdit={handleEditCollectionClick} 
          />
        );
      }
      return (
        <div className="text-center py-20 bg-white border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center">
          <div className="text-4xl mb-3">📂</div>
          <p className="text-gray-400 font-medium mb-4">No collections created yet.</p>
          <Button onClick={() => setModalOpen(true)}>+ Create Collection</Button>
        </div>
      );
    }
  };

  return (
    <Layout onNavigate={setView} activeView={view}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight capitalize">{view}</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">Manage and organize your AI library.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {view === 'prompts' && (
            <div className="w-full sm:w-auto">
              <SearchBar onSearch={handleSearch} value={searchQuery} />
            </div>
          )}
          <Button onClick={() => setModalOpen(true)} className="w-full sm:w-auto">+ Create</Button>
        </div>
      </div>

      {view === 'prompts' && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Collection</span>
              <select value={activeCollection} onChange={(e) => handleCollectionFilter(e.target.value)} className="w-full lg:w-auto bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none">
                <option value="">All Collections</option>
                {collections.map(col => <option key={col.id} value={col.id}>{col.name}</option>)}
              </select>
            </div>
            <div className="flex-1 flex items-center gap-3 overflow-hidden">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tags</span>
              <div className="flex flex-nowrap lg:flex-wrap gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                {allAvailableTags.map(tag => (
                  <button key={tag} onClick={() => handleTagToggle(tag)} className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${activeTags.includes(tag) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>#{tag}</button>
                ))}
              </div>
            </div>
            {(activeCollection || activeTags.length > 0 || searchQuery) && (
              <button onClick={handleResetFilters} className="text-xs font-bold text-red-500 hover:underline px-2 lg:ml-auto">Reset Filters</button>
            )}
          </div>
        </div>
      )}

      <div className="w-full">{renderContent()}</div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedPrompt ? "Details" : editingPrompt ? "Edit Prompt" : editingCollection ? "Edit Collection" : (view === 'prompts' ? "New Prompt" : "New Collection")}>
        {selectedPrompt ? <PromptDetail prompt={selectedPrompt} collections={collections} onEdit={(p) => { setSelectedPrompt(null); handleEditClick(p); }} onDelete={(id) => { setSelectedPrompt(null); setModalOpen(false); handleDeletePrompt(id); }} /> : view === 'prompts' ? <PromptForm onSave={handleRefresh} collections={collections} initialData={editingPrompt} /> : <CollectionForm onSave={handleRefresh} initialData={editingCollection} />}
      </Modal>

      <ConfirmDialog isOpen={confirmDelete.isOpen} loading={isDeleting} onClose={() => setConfirmDelete({ ...confirmDelete, isOpen: false })} onConfirm={executeDelete} title={`Delete ${confirmDelete.type}`} message={confirmDelete.type === 'collection' ? `Delete "${confirmDelete.title}" and its prompts?` : `Delete "${confirmDelete.title}"?`} />
    </Layout>
  );
}

export default App;