"""Utility functions for PromptLab"""

from typing import List
from app.models import Prompt


def sort_prompts_by_date(prompts: List[Prompt], descending: bool = True) -> List[Prompt]:
    """Sort prompts by creation date.
    
    Args:
        prompts: A list of Prompt objects to be sorted.
        descending: Whether to sort in descending order.
    
    Returns:
        A list of sorted Prompt objects.
    
    Note:
        There might be a bug here. Check the sort order!
    
    Example:
        >>> sorted_prompts = sort_prompts_by_date(prompts)
        >>> print(sorted_prompts[0].created_at)
    """
    return sorted(prompts, key=lambda p: p.created_at, reverse=descending)


def filter_prompts_by_collection(prompts: List[Prompt], collection_id: str) -> List[Prompt]:
    """Filter prompts by their collection ID.
    
    Args:
        prompts: A list of Prompt objects to be filtered.
        collection_id: The collection ID to filter prompts by.
    
    Returns:
        A list of prompts that belong to the specified collection.
    
    Example:
        >>> filtered_prompts = filter_prompts_by_collection(prompts, "123")
        >>> print(len(filtered_prompts))
        10
    """
    return [p for p in prompts if p.collection_id == collection_id]


def search_prompts(prompts: List[Prompt], query: str) -> List[Prompt]:
    """Search for prompts by query string in title or description.
    
    Args:
        prompts: A list of Prompt objects to search within.
        query: The search query string.
    
    Returns:
        A list of prompts containing the query in their title or description.
    
    Example:
        >>> search_results = search_prompts(prompts, "machine learning")
        >>> print(len(search_results))
        5
    """
    query_lower = query.lower()
    return [
        p for p in prompts 
        if query_lower in p.title.lower() or 
           (p.description and query_lower in p.description.lower())
    ]


def validate_prompt_content(content: str) -> bool:
    """Check if prompt content is valid.
    
    A valid prompt should:
    - Not be empty
    - Not be just whitespace
    - Be at least 10 characters

    Args:
        content: The content of the prompt to validate.
    
    Returns:
        True if the content is valid, False otherwise.
    
    Example:
        >>> is_valid = validate_prompt_content("This is a valid prompt.")
        >>> print(is_valid)
        True
    """
    if not content or not content.strip():
        return False
    return len(content.strip()) >= 10


def extract_variables(content: str) -> List[str]:
    """Extract template variables from prompt content.
    
    Variables are in the format {{variable_name}}.

    Args:
        content: The content of the prompt from which to extract variables.
    
    Returns:
        A list of variable names found in the content.
    
    Example:
        >>> variables = extract_variables("Hello {{name}}, welcome!")
        >>> print(variables)
        ['name']
    """
    import re
    pattern = r'\{\{(\w+)\}\}'
    return re.findall(pattern, content)
