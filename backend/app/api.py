"""FastAPI routes for PromptLab"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from app.models import (
    Prompt, PromptCreate, PromptUpdate, PromptPatch,
    Collection, CollectionCreate,
    PromptList, CollectionList, HealthResponse,
    get_current_time
)
from app.storage import storage
from app.utils import sort_prompts_by_date, filter_prompts_by_collection, search_prompts
from app import __version__
from app.seed_data import seed_initial_data


app = FastAPI(
    title="PromptLab API",
    description="AI Prompt Engineering Platform",
    version=__version__
)
# uncomment below code to seed the data initially
# @app.on_event("startup")
# def startup_event():
#     if not storage.get_all_collections():
#         seed_initial_data()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============== Health Check ==============

@app.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    """Check the health of the API.
    
    Returns:
        HealthResponse: Contains the status and version of the API.
    """
    return HealthResponse(status="healthy", version=__version__)


# ============== Prompt Endpoints ==============

@app.get("/prompts", response_model=PromptList)
def list_prompts(
    collection_id: Optional[str] = None,
    search: Optional[str] = None
) -> PromptList:
    """List all available prompts, optionally filtered by collection or search term.
    
    Args:
        collection_id: The ID of the collection to filter prompts.
        search: A search term to filter prompts by content.
    
    Returns:
        A list of prompts with the total count.
    """
    prompts = storage.get_all_prompts()
    
    # Filter by collection if specified
    if collection_id:
        prompts = filter_prompts_by_collection(prompts, collection_id)
    
    # Search if query provided
    if search:
        prompts = search_prompts(prompts, search)
    
    # Sort by date (newest first)
    # Note: There might be an issue with the sorting...
    prompts = sort_prompts_by_date(prompts, descending=True)
    
    return PromptList(prompts=prompts, total=len(prompts))


@app.get("/prompts/{prompt_id}", response_model=Prompt)
def get_prompt(prompt_id: str) -> Prompt:
    """Retrieve a specific prompt by its ID.
    
    Args:
        prompt_id: The ID of the prompt to retrieve.
    
    Returns:
        The prompt object matching the provided ID.
    
    Raises:
        HTTPException: If the prompt with the given ID is not found.
    """
    prompt = storage.get_prompt(prompt_id)
    if not prompt:  # Checks if storage returned None 
        raise HTTPException(status_code=404, detail="Prompt not found")
    
    return prompt


@app.post("/prompts", response_model=Prompt, status_code=201)
def create_prompt(prompt_data: PromptCreate) -> Prompt:
    """Create a new prompt.

    Args:
        prompt_data: Data needed to create a prompt.
    
    Returns:
        The created prompt object.
    
    Raises:
        HTTPException: If the specified collection ID does not exist.
    """
    # Validate collection exists if provided
    if prompt_data.collection_id:
        collection = storage.get_collection(prompt_data.collection_id)
        if not collection:
            raise HTTPException(status_code=400, detail="Collection not found")
    
    prompt = Prompt(**prompt_data.model_dump())
    return storage.create_prompt(prompt)


@app.put("/prompts/{prompt_id}", response_model=Prompt)
def update_prompt(prompt_id: str, prompt_data: PromptUpdate) -> Prompt:
    """Update an existing prompt by its ID.
    
    Args:
        prompt_id: The ID of the prompt to update.
        prompt_data: Data to update in the prompt.
    
    Returns:
        The updated prompt object.
    
    Raises:
        HTTPException: If the prompt or collection does not exist.
    """
    existing = storage.get_prompt(prompt_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Prompt not found")
    
    # Validate collection if provided
    if prompt_data.collection_id:
        collection = storage.get_collection(prompt_data.collection_id)
        if not collection:
            raise HTTPException(status_code=400, detail="Collection not found")
    
    updated_prompt = Prompt(
        id=existing.id,
        title=prompt_data.title,
        content=prompt_data.content,
        description=prompt_data.description,
        collection_id=prompt_data.collection_id,
        created_at=existing.created_at,
        updated_at=get_current_time()
    )
    
    return storage.update_prompt(prompt_id, updated_prompt)


@app.patch("/prompts/{prompt_id}", response_model=Prompt)
def patch_prompt(prompt_id: str, prompt_data: PromptPatch) -> Prompt:
    """Partially update an existing prompt by its ID.
    
    Args:
        prompt_id: The ID of the prompt to patch.
        prompt_data: Data to patch in the prompt.
    
    Returns:
        The updated prompt object.
    
    Raises:
        HTTPException: If the prompt is not found or no fields are provided for the update.
    """
    existing = storage.get_prompt(prompt_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Prompt not found")

    update_data = prompt_data.model_dump(exclude_unset=True)

    if not update_data:
        raise HTTPException(status_code=400, detail="At least one field must be provided to update")

    updated_prompt = existing.model_copy(update=update_data)
    updated_prompt.updated_at = get_current_time()

    return storage.update_prompt(prompt_id, updated_prompt)


@app.delete("/prompts/{prompt_id}", status_code=204)
def delete_prompt(prompt_id: str) -> None:
    """Delete a prompt by its ID.
    
    Args:
        prompt_id: The ID of the prompt to delete.
    
    Returns:
        None
    
    Raises:
        HTTPException: If the prompt with the given ID is not found.
    """
    if not storage.delete_prompt(prompt_id):
        raise HTTPException(status_code=404, detail="Prompt not found")
    return None


# ============== Collection Endpoints ==============

@app.get("/collections", response_model=CollectionList)
def list_collections() -> CollectionList:
    """List all collections.
    
    Returns:
        A list of collections with the total count.
    """
    collections = storage.get_all_collections()
    return CollectionList(collections=collections, total=len(collections))


@app.get("/collections/{collection_id}", response_model=Collection)
def get_collection(collection_id: str) -> Collection:
    """Retrieve a specific collection by its ID.
    
    Args:
        collection_id: The ID of the collection to retrieve.
    
    Returns:
        The collection object matching the provided ID.
    
    Raises:
        HTTPException: If the collection with the given ID is not found.
    """
    collection = storage.get_collection(collection_id)
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    return collection


@app.post("/collections", response_model=Collection, status_code=201)
def create_collection(collection_data: CollectionCreate) -> Collection:
    """Create a new collection.
    
    Args:
        collection_data: Data needed to create a collection.
    
    Returns:
        The created collection object.
    """
    collection = Collection(**collection_data.model_dump())
    return storage.create_collection(collection)


@app.delete("/collections/{collection_id}", status_code=204)
def delete_collection(collection_id: str) -> None:
    """Delete a collection by its ID and all prompts within it.
    
    Args:
        collection_id: The ID of the collection to delete.
    
    Returns:
        None
    
    Raises:
        HTTPException: If the collection with the given ID is not found.
    """
    # Should either: delete the prompts, set collection_id to None, or prevent deletion

    # As of now deleting the collection and prompts inside it 
    # From frontend we can display popup to confirm or implement based on requirement
        
    collection = storage.get_collection(collection_id)
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    # Remove all prompts that belong to this collection
    prompts_to_delete = storage.get_prompts_by_collection(collection_id)
    for prompt in prompts_to_delete:
        storage.delete_prompt(prompt.id)

    # Delete the collection
    storage.delete_collection(collection_id)
    
    return None
