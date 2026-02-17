"""In-memory storage for PromptLab

This module provides simple in-memory storage for prompts and collections.
In a production environment, this would be replaced with a database.
"""

from typing import Dict, List, Optional
from app.models import Prompt, Collection


class Storage:
    """In-memory storage for managing prompts and collections.

    This class provides methods to create, retrieve, update, and delete
    prompts and collections.
    """
    def __init__(self):
        """Initialize the storage with empty dictionaries for prompts and collections."""
        self._prompts: Dict[str, Prompt] = {}
        self._collections: Dict[str, Collection] = {}
    
    # ============== Prompt Operations ==============
    
    def create_prompt(self, prompt: Prompt) -> Prompt:
        """Create a new prompt and store it in memory.

        Args:
            prompt: The prompt object to be stored.

        Returns:
            The stored prompt object.

        Example:
            >>> new_prompt = Prompt(id="1", title="Example", content="...")
            >>> storage.create_prompt(new_prompt)
        """
        self._prompts[prompt.id] = prompt
        return prompt
    
    def get_prompt(self, prompt_id: str) -> Optional[Prompt]:
        """Retrieve a prompt by its unique identifier.

        Args:
            prompt_id: The unique identifier of the prompt to retrieve.

        Returns:
            The Prompt object if found, None otherwise.

        Example:
            >>> prompt = storage.get_prompt("abc123")
            >>> print(prompt.title)
        """
        return self._prompts.get(prompt_id)
    
    def get_all_prompts(self) -> List[Prompt]:
        """Retrieve all stored prompts.

        Returns:
            A list of all prompt objects stored.

        Example:
            >>> all_prompts = storage.get_all_prompts()
            >>> print(len(all_prompts))
        """
        return list(self._prompts.values())
    
    def update_prompt(self, prompt_id: str, prompt: Prompt) -> Optional[Prompt]:
        """Update an existing prompt.

        Args:
            prompt_id: The unique identifier of the prompt to update.
            prompt: The new prompt object to replace the existing one.

        Returns:
            The updated prompt object if it exists, None otherwise.

        Example:
            >>> updated_prompt = Prompt(id="1", title="Updated Title", content="...")
            >>> storage.update_prompt("1", updated_prompt)
        """
        if prompt_id not in self._prompts:
            return None
        self._prompts[prompt_id] = prompt
        return prompt
    
    def delete_prompt(self, prompt_id: str) -> bool:
        """Delete a prompt by its unique identifier.

        Args:
            prompt_id: The unique identifier of the prompt to delete.

        Returns:
            True if the prompt was deleted, False otherwise.

        Example:
            >>> success = storage.delete_prompt("abc123")
            >>> print(success)
        """
        if prompt_id in self._prompts:
            del self._prompts[prompt_id]
            return True
        return False
    
    # ============== Collection Operations ==============
    
    def create_collection(self, collection: Collection) -> Collection:
        """Create a new collection and store it in memory.

        Args:
            collection: The collection object to be stored.

        Returns:
            The stored collection object.

        Example:
            >>> new_collection = Collection(id="1", name="Example Collection")
            >>> storage.create_collection(new_collection)
        """
        self._collections[collection.id] = collection
        return collection
    
    def get_collection(self, collection_id: str) -> Optional[Collection]:
        """Retrieve a collection by its unique identifier.

        Args:
            collection_id: The unique identifier of the collection to retrieve.

        Returns:
            The Collection object if found, None otherwise.

        Example:
            >>> collection = storage.get_collection("123")
            >>> print(collection.name)
        """
        return self._collections.get(collection_id)
    
    def get_all_collections(self) -> List[Collection]:
        """Retrieve all stored collections.

        Returns:
            A list of all collection objects stored.

        Example:
            >>> all_collections = storage.get_all_collections()
            >>> print(len(all_collections))
        """
        return list(self._collections.values())
    
    def delete_collection(self, collection_id: str) -> bool:
        """Delete a collection by its unique identifier.

        Args:
            collection_id: The unique identifier of the collection to delete.

        Returns:
            True if the collection was deleted, False otherwise.

        Example:
            >>> success = storage.delete_collection("123")
            >>> print(success)
        """
        if collection_id in self._collections:
            del self._collections[collection_id]
            return True
        return False
    
    def get_prompts_by_collection(self, collection_id: str) -> List[Prompt]:
        """Retrieve prompts belonging to a specific collection.

        Args:
            collection_id: The collection ID to filter prompts by.

        Returns:
            A list of prompts that belong to the specified collection.

        Example:
            >>> prompts = storage.get_prompts_by_collection("123")
            >>> print(len(prompts))
        """
        return [p for p in self._prompts.values() if p.collection_id == collection_id]
    
    # ============== Utility ==============
    
    def clear(self):
        """Clear all prompts and collections from storage.

        Example:
            >>> storage.clear()
            >>> print(storage.get_all_prompts())
        """
        self._prompts.clear()
        self._collections.clear()


# Global storage instance
storage = Storage()
