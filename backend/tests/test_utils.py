import pytest
from datetime import datetime, timedelta
from app.models import Prompt
from app.utils import (
    sort_prompts_by_date,
    filter_prompts_by_collection,
    search_prompts,
    validate_prompt_content,
    extract_variables
)


class TestUtils:
    """Tests for utility functions."""

    def test_sort_prompts_by_date(self):
        """Test sorting of prompts by creation date."""
        later_time = datetime.utcnow()
        earlier_time = later_time - timedelta(days=1)

        prompts = [
            Prompt(id="1", title="First", content="Content", created_at=later_time, updated_at=later_time),
            Prompt(id="2", title="Second", content="Content", created_at=earlier_time, updated_at=earlier_time),
        ]

        # Default descending order
        sorted_prompts = sort_prompts_by_date(prompts)
        assert sorted_prompts[0].id == "1"

        # Ascending order
        sorted_prompts = sort_prompts_by_date(prompts, descending=False)
        assert sorted_prompts[0].id == "2"

    def test_filter_prompts_by_collection(self):
        """Test filtering prompts by collection ID."""
        prompts = [
            Prompt(id="1", title="Prompt 1", content="Content", collection_id="col1"),
            Prompt(id="2", title="Prompt 2", content="Content", collection_id="col2"),
            Prompt(id="3", title="Prompt 3", content="Content", collection_id="col1"),
        ]

        filtered_prompts = filter_prompts_by_collection(prompts, "col1")
        assert len(filtered_prompts) == 2
        assert all(p.collection_id == "col1" for p in filtered_prompts)

    def test_filter_prompts_by_collection_no_match(self):
        """Test filtering prompts by a non-existent collection ID."""
        prompts = [
            Prompt(id="1", title="Prompt 1", content="Content", collection_id="col1")
        ]
        filtered_prompts = filter_prompts_by_collection(prompts, "colX")
        assert len(filtered_prompts) == 0

    def test_search_prompts(self):
        """Test searching for prompts containing a query string."""
        prompts = [
            Prompt(id="1", title="Machine Learning", content="AI Content"),
            Prompt(id="2", title="Deep Learning", content="Content", description="Learn deep learning"),
        ]

        search_results = search_prompts(prompts, "Learning")
        assert len(search_results) == 2

        search_results = search_prompts(prompts, "Machine")
        assert len(search_results) == 1
        assert search_results[0].id == "1"

    def test_search_prompts_no_match(self):
        """Test searching for prompts with no matching content."""
        prompts = [Prompt(id="1", title="Title", content="No match")]
        search_results = search_prompts(prompts, "Query")
        assert len(search_results) == 0

    def test_validate_prompt_content(self):
        """Test validation of prompt content."""
        assert validate_prompt_content("Valid content!") is True
        assert validate_prompt_content("Short") is False
        assert validate_prompt_content("") is False
        assert validate_prompt_content("    ") is False

    def test_extract_variables(self):
        """Test extraction of variables from prompt content."""
        content = "Hello {{name}}, today is {{day}}."
        variables = extract_variables(content)
        assert variables == ["name", "day"]

    def test_extract_variables_no_match(self):
        """Test extraction with no variables present."""
        content = "No variables here."
        variables = extract_variables(content)
        assert variables == []