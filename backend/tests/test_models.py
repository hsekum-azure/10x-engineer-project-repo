import pytest
from pydantic import ValidationError
from app.models import (
    Prompt,
    PromptCreate,
    Collection,
    CollectionCreate,
    PromptList,
    CollectionList,
    HealthResponse,
)


class TestPromptModels:
    """Test suite for Prompt models."""

    def test_prompt_create_validation(self):
        """Ensure prompt creation with required fields succeeds."""
        data = {
            "title": "Valid Title",
            "content": "Valid content."
        }
        prompt = PromptCreate(**data)
        assert prompt.title == "Valid Title"
        assert prompt.content == "Valid content."

    def test_prompt_create_validation_failure(self):
        """Ensure prompt creation with missing required fields fails."""
        # Title is missing
        data = {"content": "Valid content."}
        with pytest.raises(ValidationError):
            PromptCreate(**data)

    def test_prompt_default_values(self):
        """Test default values for Prompt model."""
        data = {
            "title": "Test Title",
            "content": "Sample content.",
            "description": "A description."
        }
        prompt = Prompt(**data)
        assert prompt.id is not None  # Auto-generated ID
        assert prompt.created_at is not None
        assert prompt.updated_at is not None

    def test_prompt_serialization(self):
        """Test serialization of a prompt."""
        data = {
            "title": "Test Title",
            "content": "Sample content.",
            "description": "A description."
        }
        prompt = Prompt(**data)
        serialized = prompt.json()
        assert 'Test Title' in serialized
        assert 'Sample content.' in serialized


class TestCollectionModels:
    """Test suite for Collection models."""

    def test_collection_create_validation(self):
        """Ensure collection creation with required fields succeeds."""
        data = {
            "name": "Test Collection"
        }
        collection = CollectionCreate(**data)
        assert collection.name == "Test Collection"

    def test_collection_create_validation_failure(self):
        """Ensure collection creation with missing required fields fails."""
        # Name is missing
        data = {}
        with pytest.raises(ValidationError):
            CollectionCreate(**data)

    def test_collection_default_values(self):
        """Test default values for Collection model."""
        data = {"name": "Sample Collection"}
        collection = Collection(**data)
        assert collection.id is not None
        assert collection.created_at is not None

    def test_collection_serialization(self):
        """Test serialization of a collection."""
        data = {"name": "Sample Collection"}
        collection = Collection(**data)
        serialized = collection.json()
        assert 'Sample Collection' in serialized


class TestResponseModels:
    """Test suite for response models like PromptList and CollectionList."""

    def test_prompt_list_model(self):
        """Test PromptList model validation and serialization."""
        prompt = Prompt(
            title="Test Title", content="Content", description="A description"
        )
        prompt_list = PromptList(prompts=[prompt], total=1)
        assert prompt_list.total == 1
        assert len(prompt_list.prompts) == 1
        serialized = prompt_list.json()
        assert 'Test Title' in serialized

    def test_collection_list_model(self):
        """Test CollectionList model validation and serialization."""
        collection = Collection(name="Sample Collection")
        collection_list = CollectionList(collections=[collection], total=1)
        assert collection_list.total == 1
        assert len(collection_list.collections) == 1
        serialized = collection_list.json()
        assert 'Sample Collection' in serialized

    def test_health_response_model(self):
        """Test HealthResponse model validation."""
        health = HealthResponse(status="healthy", version="1.0.0")
        assert health.status == "healthy"
        assert health.version == "1.0.0"
        serialized = health.json()
        assert 'healthy' in serialized