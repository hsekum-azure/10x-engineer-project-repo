"""Pydantic models for PromptLab"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from uuid import uuid4


def generate_id() -> str:
    """Generate a unique identifier.

    Returns:
        str: A new UUID in string format.
    """
    return str(uuid4())


def get_current_time() -> datetime:
    """Get the current UTC time.

    Returns:
        datetime: The current UTC time.
    """
    return datetime.utcnow()


# ============== Prompt Models ==============

class PromptBase(BaseModel):
    """Base model for a Prompt.

    Attributes:
        title (str): The title of the prompt.
        content (str): The main content of the prompt.
        description (Optional[str]): A brief description of the prompt.
        collection_id (Optional[str]): Identifier for the collection this prompt belongs to.
    """
    title: str = Field(..., min_length=1, max_length=200, description="The title of the prompt.")
    content: str = Field(..., min_length=1, description="The main content of the prompt.")
    description: Optional[str] = Field(None, max_length=500, description="A brief description of the prompt.")
    collection_id: Optional[str] = Field(None, description="Identifier for the collection this prompt belongs to.")


class PromptCreate(PromptBase):
    """Model for creating a new prompt."""
    pass


class PromptUpdate(PromptBase):
    """Model for updating an existing prompt."""
    pass


class PromptPatch(BaseModel):
    """Model for patching fields of an existing prompt.

    Attributes:
        title (Optional[str]): The title of the prompt.
        content (Optional[str]): The main content of the prompt.
        description (Optional[str]): A brief description of the prompt.
        collection_id (Optional[str]): Identifier for the collection this prompt belongs to.
    """
    title: Optional[str] = Field(None, min_length=1, max_length=200, description="The title of the prompt.")
    content: Optional[str] = Field(None, min_length=1, description="The main content of the prompt.")
    description: Optional[str] = Field(None, max_length=500, description="A brief description of the prompt.")
    collection_id: Optional[str] = Field(None, description="Identifier for the collection this prompt belongs to.")


class Prompt(PromptBase):
    """Model for a complete prompt, including metadata.

    Attributes:
        id (str): Unique identifier for the prompt.
        created_at (datetime): Timestamp when the prompt was created.
        updated_at (datetime): Timestamp when the prompt was last updated.
    """
    id: str = Field(default_factory=generate_id, description="Unique identifier for the prompt.")
    created_at: datetime = Field(default_factory=get_current_time, description="Timestamp when the prompt was created.")
    updated_at: datetime = Field(default_factory=get_current_time, description="Timestamp when the prompt was last updated.")

    class Config:
        from_attributes = True


# ============== Collection Models ==============

class CollectionBase(BaseModel):
    """Base model for a Collection.

    Attributes:
        name (str): The name of the collection.
        description (Optional[str]): A brief description of the collection.
    """
    name: str = Field(..., min_length=1, max_length=100, description="The name of the collection.")
    description: Optional[str] = Field(None, max_length=500, description="A brief description of the collection.")


class CollectionCreate(CollectionBase):
    """Model for creating a new collection."""
    pass


class Collection(CollectionBase):
    """Model for a complete collection, including metadata.

    Attributes:
        id (str): Unique identifier for the collection.
        created_at (datetime): Timestamp when the collection was created.
    """
    id: str = Field(default_factory=generate_id, description="Unique identifier for the collection.")
    created_at: datetime = Field(default_factory=get_current_time, description="Timestamp when the collection was created.")

    class Config:
        from_attributes = True


# ============== Response Models ==============

class PromptList(BaseModel):
    """Model for a list of prompts and total count.

    Attributes:
        prompts (List[Prompt]): List of prompt objects.
        total (int): Total number of prompts.
    """
    prompts: List[Prompt]
    total: int


class CollectionList(BaseModel):
    """Model for a list of collections and total count.

    Attributes:
        collections (List[Collection]): List of collection objects.
        total (int): Total number of collections.
    """
    collections: List[Collection]
    total: int


class HealthResponse(BaseModel):
    """Model for a health check response.

    Attributes:
        status (str): Status of the API health.
        version (str): API version number.
    """
    status: str
    version: str
