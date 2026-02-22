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
 
    def test_get_all_tags_logic(self, storage):
        """Covers lines 137-142: Aggregating unique tags from multiple prompts."""
        p1 = Prompt(title="P1", content="C1", tags=["python", "fastapi"])
        p2 = Prompt(title="P2", content="C2", tags=["fastapi", "docker"])
        storage.create_prompt(p1)
        storage.create_prompt(p2)
        
        tags = storage.get_all_tags()
        # Verify it's a unique list (no duplicates)
        assert set(tags) == {"python", "fastapi", "docker"}
        assert len(tags) == 3

    def test_get_all_tags_empty_storage(self, storage):
        """Verify get_all_tags returns empty list when no prompts exist."""
        assert storage.get_all_tags() == []

    def test_filter_prompts_by_tags_and_logic(self, storage):
        """Covers lines 165-174: Filtering logic requiring ALL tags to match."""
        p1 = Prompt(title="Match", content="C1", tags=["a", "b", "c"])
        p2 = Prompt(title="Partial", content="C2", tags=["a", "z"])
        p3 = Prompt(title="None", content="C3", tags=["x"])
        
        prompts_list = [p1, p2, p3]
        
        # Test 1: Multiple tags (AND logic)
        results = storage.filter_prompts_by_tags(prompts_list, ["a", "b"])
        assert len(results) == 1
        assert results[0].title == "Match"

        # Test 2: Case insensitivity in search
        results_case = storage.filter_prompts_by_tags(prompts_list, ["A"])
        assert len(results_case) == 2  # Match and Partial

    def test_filter_prompts_by_tags_no_input(self, storage):
        """Covers line 166: Passing empty tags list returns original prompts."""
        p_list = [Prompt(title="P1", content="C1", tags=["tag"])]
        results = storage.filter_prompts_by_tags(p_list, [])
        assert results == p_list

    def test_filter_prompts_by_tags_no_match(self, storage):
        """Verify empty list returned when no prompt contains the tag."""
        p_list = [Prompt(title="P1", content="C1", tags=["a"])]
        results = storage.filter_prompts_by_tags(p_list, ["nonexistent"])
        assert results == []