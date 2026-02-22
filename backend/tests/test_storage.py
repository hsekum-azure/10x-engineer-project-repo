import pytest
from app.models import Prompt, Collection
from app.storage import Storage

@pytest.fixture
def storage():
    """Fixture to provide a fresh storage instance for each test."""
    s = Storage()
    yield s
    s.clear()  # Ensure storage is cleared after each test

@pytest.fixture
def sample_prompt():
    """Fixture for creating a sample prompt."""
    return Prompt(
        id="prompt1",
        title="Sample Prompt",
        content="This is a sample prompt content.",
        description="Description for sample prompt",
        collection_id="col1",
        created_at=0,  # Replace with actual timestamp in real tests
        updated_at=0
    )

@pytest.fixture
def sample_collection():
    """Fixture for creating a sample collection."""
    return Collection(
        id="col1",
        name="Sample Collection"
    )

class TestStorage:
    """Tests for the Storage class."""

    def test_create_and_retrieve_prompt(self, storage, sample_prompt):
        """Test creating and retrieving a prompt."""
        storage.create_prompt(sample_prompt)
        retrieved = storage.get_prompt(sample_prompt.id)
        assert retrieved == sample_prompt

    def test_update_prompt(self, storage, sample_prompt):
        """Test updating an existing prompt."""
        storage.create_prompt(sample_prompt)
        updated_prompt = Prompt(
            id=sample_prompt.id,
            title="Updated Title",
            content=sample_prompt.content,
            description=sample_prompt.description,
            collection_id=sample_prompt.collection_id,
            created_at=sample_prompt.created_at,
            updated_at=1  # Replace with actual updated timestamp
        )
        storage.update_prompt(updated_prompt.id, updated_prompt)
        retrieved = storage.get_prompt(updated_prompt.id)
        assert retrieved.title == "Updated Title"

    def test_delete_prompt(self, storage, sample_prompt):
        """Test deleting a prompt."""
        storage.create_prompt(sample_prompt)
        assert storage.delete_prompt(sample_prompt.id) is True
        assert storage.get_prompt(sample_prompt.id) is None

    def test_create_and_retrieve_collection(self, storage, sample_collection):
        """Test creating and retrieving a collection."""
        storage.create_collection(sample_collection)
        retrieved = storage.get_collection(sample_collection.id)
        assert retrieved == sample_collection

    def test_delete_collection(self, storage, sample_collection):
        """Test deleting a collection."""
        storage.create_collection(sample_collection)
        assert storage.delete_collection(sample_collection.id) is True
        assert storage.get_collection(sample_collection.id) is None

    def test_get_prompts_by_collection(self, storage, sample_prompt, sample_collection):
        """Test retrieving prompts by collection."""
        storage.create_collection(sample_collection)
        storage.create_prompt(sample_prompt)
        prompts = storage.get_prompts_by_collection(sample_collection.id)
        assert len(prompts) == 1
        assert prompts[0] == sample_prompt

    def test_clear_storage(self, storage, sample_prompt, sample_collection):
        """Test clearing all data from storage."""
        storage.create_collection(sample_collection)
        storage.create_prompt(sample_prompt)
        storage.clear()
        assert len(storage.get_all_prompts()) == 0
        assert len(storage.get_all_collections()) == 0

    def test_edge_case_non_existent_prompt(self, storage):
        """Test operations on non-existent prompt."""
        assert storage.get_prompt("nonexistent") is None
        assert storage.delete_prompt("nonexistent") is False

    def test_update_non_existent_prompt(self, storage, sample_prompt):
        """Line 82: Test updating a prompt that doesn't exist returns None."""
        # Ensure the prompt is NOT in storage
        result = storage.update_prompt("ghost-id", sample_prompt)
        assert result is None

    def test_delete_non_existent_collection(self, storage):
        """Line 165: Test deleting a collection that doesn't exist returns False."""
        # Ensure the collection is NOT in storage
        result = storage.delete_collection("nonexistent-collection")
        assert result is False        