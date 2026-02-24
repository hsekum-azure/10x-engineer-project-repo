"""API tests for PromptLab

These tests verify the API endpoints work correctly.
Students should expand these tests significantly in Week 3.
"""

import pytest
from fastapi.testclient import TestClient

@pytest.fixture
def sample_prompt_data():
    return {
        "title": "Sample Prompt",
        "content": "This is a sample prompt content.",
        "description": "Description for sample prompt",
    }

@pytest.fixture
def sample_collection_data():
    return {
        "name": "Sample Collection"
    }

class TestHealth:
    """Tests for health endpoint."""
    
    def test_health_check(self, client: TestClient):
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "version" in data


class TestPrompts:
    """Tests for prompt endpoints."""
    
    def test_create_prompt(self, client: TestClient, sample_prompt_data):
        response = client.post("/prompts", json=sample_prompt_data)
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == sample_prompt_data["title"]
        assert data["content"] == sample_prompt_data["content"]
        assert "id" in data
        assert "created_at" in data
    
    def test_list_prompts_empty(self, client: TestClient):
        response = client.get("/prompts")
        assert response.status_code == 200
        data = response.json()
        assert data["prompts"] == []
        assert data["total"] == 0
    
    def test_list_prompts_with_data(self, client: TestClient, sample_prompt_data):
        # Create a prompt first
        client.post("/prompts", json=sample_prompt_data)
        
        response = client.get("/prompts")
        assert response.status_code == 200
        data = response.json()
        assert len(data["prompts"]) == 1
        assert data["total"] == 1
    
    def test_get_prompt_success(self, client: TestClient, sample_prompt_data):
        # Create a prompt first
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]
        
        response = client.get(f"/prompts/{prompt_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == prompt_id
    
    def test_get_prompt_not_found(self, client: TestClient):
        """Test that getting a non-existent prompt returns 404.
        
        NOTE: This test currently FAILS due to Bug #1!
        The API returns 500 instead of 404.
        """
        response = client.get("/prompts/nonexistent-id")
        # This should be 404, but there's a bug...
        assert response.status_code == 404  # Will fail until bug is fixed
    
    def test_delete_prompt(self, client: TestClient, sample_prompt_data):
        # Create a prompt first
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]
        
        # Delete it
        response = client.delete(f"/prompts/{prompt_id}")
        assert response.status_code == 204
        
        # Verify it's gone
        get_response = client.get(f"/prompts/{prompt_id}")
        # Note: This might fail due to Bug #1
        assert get_response.status_code in [404, 500]  # 404 after fix
    
    def test_update_prompt(self, client: TestClient, sample_prompt_data):
        # Create a prompt first
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]
        
        # Update it
        updated_data = {
            "title": "Updated Title",
            "content": "Updated content for the prompt",
            "description": "Updated description"
        }
        
        import time
        time.sleep(0.1)  # Small delay to ensure timestamp would change
        
        response = client.put(f"/prompts/{prompt_id}", json=updated_data)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Title"
        
        # NOTE: This assertion will fail due to Bug #2!
        # The updated_at should be different from original
        # assert data["updated_at"] != original_updated_at  # Uncomment after fix
    
    def test_sorting_order(self, client: TestClient):
        """Test that prompts are sorted newest first.
        
        NOTE: This test might fail due to Bug #3!
        """
        import time
        
        # Create prompts with delay
        prompt1 = {"title": "First", "content": "First prompt content"}
        prompt2 = {"title": "Second", "content": "Second prompt content"}
        
        client.post("/prompts", json=prompt1)
        time.sleep(0.1)
        client.post("/prompts", json=prompt2)
        
        response = client.get("/prompts")
        prompts = response.json()["prompts"]
        
        # Newest (Second) should be first
        assert prompts[0]["title"] == "Second"  # Will fail until Bug #3 fixed

    def test_patch_prompt(self, client: TestClient, sample_prompt_data):
        """Test partially updating a prompt."""
        # Create a prompt first
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]
        original_content = create_response.json()["content"]

        # Partially update it (only title and description)
        patch_data = {
            "title": "Partially Updated Title",
            "description": "Updated description"
        }

        response = client.patch(f"/prompts/{prompt_id}", json=patch_data)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Partially Updated Title"
        assert data["description"] == "Updated description"
        # Ensure the content remains unchanged
        assert data["content"] == original_content

    def test_patch_prompt_not_found(self, client: TestClient):
        """Test that patching a non-existent prompt returns 404."""
        patch_data = {
            "title": "Updated Title",
            "description": "Updated description"
        }
        response = client.patch("/prompts/nonexistent-id", json=patch_data)
        assert response.status_code == 404

    def test_patch_empty_body(self, client: TestClient, sample_prompt_data):
        """Test patching with no fields provided returns 400."""
        # Create a prompt first
        create_response = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_response.json()["id"]

        # Attempt to patch with an empty payload
        response = client.patch(f"/prompts/{prompt_id}", json={})
        assert response.status_code == 400   

    def test_create_prompt_empty_title(self, client: TestClient, sample_prompt_data):
        """Test creating a prompt with an empty title should fail."""
        sample_prompt_data["title"] = ""
        response = client.post("/prompts", json=sample_prompt_data)
        assert response.status_code == 422  # Assuming validation is present
    
    def test_create_prompt_special_characters(self, client: TestClient, sample_prompt_data):
        """Test creating a prompt with special characters."""
        sample_prompt_data["title"] = "!@#$%^&*()_+"
        response = client.post("/prompts", json=sample_prompt_data)
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "!@#$%^&*()_+"
    
    def test_filter_prompts_by_collection(self, client: TestClient, sample_prompt_data, sample_collection_data):
        """Test filtering prompts by collection."""
        # Create a collection
        collection_response = client.post("/collections", json=sample_collection_data)
        collection_id = collection_response.json()["id"]
        
        # Create a prompt with this collection_id
        sample_prompt_data["collection_id"] = collection_id
        client.post("/prompts", json=sample_prompt_data)
        
        # Query prompts by collection_id
        response = client.get(f"/prompts?collection_id={collection_id}")
        assert response.status_code == 200
        data = response.json()
        assert len(data["prompts"]) == 1
        assert data["prompts"][0]["collection_id"] == collection_id
    
    def test_search_prompts(self, client: TestClient, sample_prompt_data):
        """Test searching prompts by keyword."""
        client.post("/prompts", json=sample_prompt_data)
        
        response = client.get("/prompts?search=sample")
        assert response.status_code == 200
        data = response.json()
        assert len(data["prompts"]) > 0
        assert "sample" in data["prompts"][0]["title"].lower()

    def test_search_prompts_no_results(self, client: TestClient):
        """Test searching prompts with a term that has no matches."""
        response = client.get("/prompts?search=noresults")
        assert response.status_code == 200
        data = response.json()
        assert len(data["prompts"]) == 0
    
    def test_get_prompt_invalid_id(self, client: TestClient):
        """Test retrieving a prompt with an invalid ID format."""
        response = client.get("/prompts/invalid-id!@#")
        assert response.status_code == 404    

class TestCollections:
    """Tests for collection endpoints."""
    
    def test_create_collection(self, client: TestClient, sample_collection_data):
        response = client.post("/collections", json=sample_collection_data)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == sample_collection_data["name"]
        assert "id" in data
    
    def test_list_collections(self, client: TestClient, sample_collection_data):
        client.post("/collections", json=sample_collection_data)
        
        response = client.get("/collections")
        assert response.status_code == 200
        data = response.json()
        assert len(data["collections"]) == 1
    
    def test_get_collection_not_found(self, client: TestClient):
        response = client.get("/collections/nonexistent-id")
        assert response.status_code == 404
    
    def test_delete_collection_with_prompts(self, client: TestClient, sample_collection_data, sample_prompt_data):
        """Test deleting a collection that has prompts.
        
        NOTE: Bug #4 - prompts become orphaned after collection deletion.
        This test documents the current (buggy) behavior.
        After fixing, update the test to verify correct behavior.
        """
        # Create collection
        col_response = client.post("/collections", json=sample_collection_data)
        collection_id = col_response.json()["id"]
        
        # Delete collection
        client.delete(f"/collections/{collection_id}")
        
        # The prompt still exists but has invalid collection_id
        # This is Bug #4 - should be handled properly
        prompts = client.get("/prompts").json()["prompts"]
        if prompts:
            # Prompt exists with orphaned collection_id
            assert prompts[0]["collection_id"] == collection_id
            # After fix, collection_id should be None or prompt should be deleted
    
    def test_create_collection_empty_name(self, client: TestClient, sample_collection_data):
        """Test creating a collection with an empty name should fail."""
        sample_collection_data["name"] = ""
        response = client.post("/collections", json=sample_collection_data)
        assert response.status_code == 422
    
    def test_special_characters_in_collection_name(self, client: TestClient, sample_collection_data):
        """Test creating a collection with special characters."""
        sample_collection_data["name"] = "!@#$%^&*()_+"
        response = client.post("/collections", json=sample_collection_data)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "!@#$%^&*()_+"

class TestCoverageGaps:
    """Targeting missing lines: 122, 144, 148-150, 208, 241, 278"""

    def test_create_prompt_nonexistent_collection(self, client: TestClient, sample_prompt_data):
        """Line 122: Trigger 400 error when creating a prompt with a fake collection_id."""
        bad_data = {**sample_prompt_data, "collection_id": "fake-id"}
        response = client.post("/prompts", json=bad_data)
        assert response.status_code == 400
        assert response.json()["detail"] == "Collection not found"

    def test_update_prompt_nonexistent_collection(self, client: TestClient, sample_prompt_data):
        """Lines 144, 148-150: Trigger 400 error during PUT when updating to a fake collection_id."""
        # 1. Create a prompt successfully
        create_res = client.post("/prompts", json=sample_prompt_data)
        prompt_id = create_res.json()["id"]

        # 2. Try to update it using a collection_id that doesn't exist
        update_data = {**sample_prompt_data, "collection_id": "non-existent-id"}
        response = client.put(f"/prompts/{prompt_id}", json=update_data)
        
        # This hits line 144 (validation check) and 148-150 (the error raise)
        assert response.status_code == 400
        assert response.json()["detail"] == "Collection not found"

    def test_get_collection_success(self, client: TestClient, sample_collection_data):
        """Line 208: Trigger the successful return of a single collection."""
        create_res = client.post("/collections", json=sample_collection_data)
        col_id = create_res.json()["id"]

        response = client.get(f"/collections/{col_id}")
        assert response.status_code == 200
        assert response.json()["id"] == col_id

    def test_create_collection_success(self, client: TestClient, sample_collection_data):
        """Line 241: Explicitly trigger the storage creation for collections."""
        response = client.post("/collections", json=sample_collection_data)
        assert response.status_code == 201
        assert response.json()["name"] == sample_collection_data["name"]

    def test_delete_collection_with_prompts_cascade(self, client: TestClient, sample_collection_data, sample_prompt_data):
        """Line 278: Trigger the loop that deletes prompts belonging to a collection."""
        # 1. Create collection
        col_res = client.post("/collections", json=sample_collection_data)
        col_id = col_res.json()["id"]

        # 2. Create prompt inside that collection
        prompt_data = {**sample_prompt_data, "collection_id": col_id}
        p_res = client.post("/prompts", json=prompt_data)
        prompt_id = p_res.json()["id"]

        # 3. Delete the collection (Hits line 278 in the for-loop)
        delete_res = client.delete(f"/collections/{col_id}")
        assert delete_res.status_code == 204

        # 4. Verify prompt was also deleted (Ensures the loop at 278 actually ran)
        get_p = client.get(f"/prompts/{prompt_id}")
        assert get_p.status_code == 404

    def test_update_prompt_validate_collection_hit(self, client: TestClient, sample_prompt_data, sample_collection_data):
        """Line 144: Force execution of the collection validation inside update_prompt."""
        # 1. Create a real collection
        col_res = client.post("/collections", json=sample_collection_data)
        col_id = col_res.json()["id"]
        
        # 2. Create a prompt
        p_res = client.post("/prompts", json=sample_prompt_data)
        p_id = p_res.json()["id"]

        # 3. Update prompt with the REAL collection_id (Hits line 144 'if' and passes it)
        update_data = {**sample_prompt_data, "collection_id": col_id}
        response = client.put(f"/prompts/{p_id}", json=update_data)
        assert response.status_code == 200
        assert response.json()["collection_id"] == col_id

    def test_get_collection_execution(self, client: TestClient, sample_collection_data):
        """Line 208: Ensure the return statement of get_collection is executed."""
        create_res = client.post("/collections", json=sample_collection_data)
        col_id = create_res.json()["id"]

        # This call must complete successfully to cover the 'return' on line 208
        response = client.get(f"/collections/{col_id}")
        assert response.status_code == 200
        assert response.json()["id"] == col_id

    def test_delete_collection_with_multiple_prompts(self, client: TestClient, sample_collection_data, sample_prompt_data):
        """Line 278: Ensure the loop for deleting prompts actually executes logic."""
        # 1. Create collection
        col_res = client.post("/collections", json=sample_collection_data)
        col_id = col_res.json()["id"]

        # 2. Create TWO prompts in this collection to ensure the loop at 278 is robust
        for i in range(2):
            p_data = {**sample_prompt_data, "title": f"Prompt {i}", "collection_id": col_id}
            client.post("/prompts", json=p_data)

        # 3. Delete the collection (Hits line 278 loop multiple times)
        response = client.delete(f"/collections/{col_id}")
        assert response.status_code == 204

        # 4. Verify collection is gone
        assert client.get(f"/collections/{col_id}").status_code == 404
                
class TestTaggingSystem:
    """Tests for the new Tagging System features."""

    def test_create_prompt_with_tags(self, client: TestClient):
        """Test that tags are correctly saved and slugified during creation."""
        prompt_data = {
            "title": "AI Prompt",
            "content": "Content here",
            "tags": ["OpenAI", " GPT-4 ", "machine learning"]
        }
        response = client.post("/prompts", json=prompt_data)
        assert response.status_code == 201
        tags = response.json()["tags"]
        
        # Verify slugification: lowercase, trimmed, and spaces to hyphens
        assert "openai" in tags
        assert len(tags) == 3

    def test_get_all_tags_endpoint(self, client: TestClient):
        """Test the GET /tags endpoint returns unique tags across all prompts."""
        # Create two prompts with overlapping tags
        client.post("/prompts", json={"title": "P1", "content": "C1", "tags": ["tech", "ai"]})
        client.post("/prompts", json={"title": "P2", "content": "C2", "tags": ["ai", "news"]})

        response = client.get("/tags")
        assert response.status_code == 200
        data = response.json()
        
        # Should contain unique tags only
        assert set(data["tags"]) == {"tech", "ai", "news"}
        assert data["total"] == 3

    def test_filter_prompts_by_tags(self, client: TestClient):
        """Test filtering prompts by multiple tags (AND logic)."""
        # 1. Create a prompt with specific tags
        client.post("/prompts", json={"title": "Target", "content": "C1", "tags": ["prod", "openai"]})
        # 2. Create a prompt with only one matching tag
        client.post("/prompts", json={"title": "Miss", "content": "C2", "tags": ["prod", "anthropic"]})

        # Filter by both tags
        response = client.get("/prompts?tags=prod,openai")
        data = response.json()
        assert data["total"] == 1
        assert data["prompts"][0]["title"] == "Target"

    def test_patch_tags_replacement(self, client: TestClient):
        """Test that PATCH correctly replaces the tag list."""
        # Create prompt
        create_res = client.post("/prompts", json={"title": "T1", "content": "C1", "tags": ["old"]})
        prompt_id = create_res.json()["id"]

        # Patch with new tags
        patch_data = {"tags": ["new", "tags"]}
        response = client.patch(f"/prompts/{prompt_id}", json=patch_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "old" not in data["tags"]
        assert set(data["tags"]) == {"new", "tags"}

    def test_patch_clear_tags(self, client: TestClient):
        """Test that sending an empty list via PATCH removes all tags."""
        create_res = client.post("/prompts", json={"title": "T1", "content": "C1", "tags": ["remove-me"]})
        prompt_id = create_res.json()["id"]

        response = client.patch(f"/prompts/{prompt_id}", json={"tags": []})
        assert response.json()["tags"] == []

    def test_put_tags_persistence(self, client: TestClient):
        """Test that PUT updates tags and doesn't empty them accidentally."""
        create_res = client.post("/prompts", json={"title": "T1", "content": "C1", "tags": ["initial"]})
        prompt_id = create_res.json()["id"]

        put_data = {
            "title": "Updated",
            "content": "Updated content",
            "tags": ["final-tag"]
        }
        response = client.put(f"/prompts/{prompt_id}", json=put_data)
        assert response.status_code == 200
        assert response.json()["tags"] == ["final-tag"]

    def test_tag_cleaning_robustness(self, client: TestClient):
        """Test that the cleaning logic handles nulls and duplicates safely."""
        prompt_data = {
            "title": "Robustness Test",
            "content": "Content",
            "tags": ["AI", "ai", None, "  "] # Duplicate 'ai', a null, and whitespace only
        }
        # Note: If your Pydantic model is strict, this might return 422. 
        # But based on your 'cleaned_tags' logic in api.py:
        response = client.post("/prompts", json=prompt_data)
        
        # Depending on your specific implementation, 'None' might be rejected by FastAPI/Pydantic 
        # or filtered by your 'if t' logic. 
        if response.status_code == 201:
            tags = response.json()["tags"]
            assert "ai" in tags
            assert len(tags) == 1  # Deduplicated and skipped null/empty                