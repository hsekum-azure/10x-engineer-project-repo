from app.models import Prompt, Collection, get_current_time, generate_id
from app.storage import storage

def seed_initial_data():
    # Create 3 collections
    for i in range(1, 4):
        collection = Collection(
            id=generate_id(),
            name=f"Collection {i}",
            description=f"This is collection {i}",
            created_at=get_current_time()
        )
        storage.create_collection(collection)

    # Create 3-4 prompts per collection
    for collection in storage.get_all_collections():
        for j in range(1, 5):  # 4 prompts per collection
            prompt = Prompt(
                id=generate_id(),
                title=f"Prompt {j} in {collection.name}",
                content=f"This is the content for prompt {j} in {collection.name}",
                description=f"Description for prompt {j}",
                collection_id=collection.id,
                created_at=get_current_time(),
                updated_at=get_current_time()
            )
            storage.create_prompt(prompt)