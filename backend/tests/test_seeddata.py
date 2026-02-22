import pytest
from app.seed_data import seed_initial_data
# Import the global 'storage' instance, NOT the 'Storage' class
from app.storage import storage as global_storage 
from app.models import Collection, Prompt

@pytest.fixture
def storage_instance():
    """Fixture to reset the global storage for each test."""
    global_storage.clear() # Start clean
    yield global_storage
    global_storage.clear() # Clean up after

def test_seed_initial_data(storage_instance):
    """Test the seed_initial_data function."""
    # This seeds the GLOBAL storage
    seed_initial_data()

    # This now checks the SAME global storage
    collections = storage_instance.get_all_collections()
    assert len(collections) == 3 

    for i, collection in enumerate(collections, 1):
        # Note: Since IDs are random, we sort or check containment 
        # but for a basic count, this works:
        prompts = storage_instance.get_prompts_by_collection(collection.id)
        assert len(prompts) == 4