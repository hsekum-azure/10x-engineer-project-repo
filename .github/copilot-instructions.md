# PromptLab: AI Coding Instructions

This document defines the coding standards and conventions for the PromptLab project. AI assistants (Copilot, Cursor, etc.) should follow these rules strictly.

## 🏗️ Project Architecture
- **Backend**: FastAPI (Python 3.10+)
- **Models**: Pydantic v2 for data validation and schemas.
- **Storage**: In-memory `Storage` class (backend/app/storage.py).
- **Frontend**: React with Vite (Week 4).

## 📜 Coding Standards & Style
- **Language**: Python 3.10+
- **Docstrings**: Use **Google-style docstrings** for all functions, classes, and methods.
- **Type Hinting**: All function signatures must include type hints for arguments and return types.
- **Linting**: Follow PEP 8 standards.

## 📁 File Naming Conventions
- **Python Files**: Use `snake_case.py` (e.g., `api_routes.py`).
- **Test Files**: Must start with `test_` and reside in the `tests/` directory (e.g., `test_api.py`).
- **React Components**: Use `PascalCase.jsx` (e.g., `PromptCard.jsx`).

## 🛠️ Preferred Patterns
- **Dependency Injection**: Use FastAPI’s `Depends` for shared logic.
- **Schema Separation**: 
    - Use `ModelCreate` for POST requests.
    - Use `ModelUpdate` for PUT (full updates).
    - Use `ModelPatch` for PATCH (partial updates).
    - Use `Model` for database/storage representation.
- **Storage Access**: Always interact with data through the `storage` instance in `app/storage.py`.

## ⚠️ Error Handling Approach
- **HTTP Exceptions**: Use `fastapi.HTTPException` for API errors.
- **Consistency**: 
    - Return `404` when a resource is not found.
    - Return `400` for validation errors or bad logic.
    - Include a clear, descriptive string in the `detail` field.
- **Validation**: Rely on Pydantic for input validation; handle `ValidationError` if necessary.

## 🧪 Testing Requirements
- **Framework**: Use `pytest`.
- **Coverage**: Maintain a minimum of **80% code coverage**.
- **Approach**: 
    - Write unit tests for all utility functions.
    - Write integration tests for all API endpoints using `TestClient`.
    - Always test both "Happy Paths" and "Edge Cases" (errors).

## 📝 Example Docstring Format
```python
def example_function(param1: str, param2: int) -> bool:
    """Brief description of the function.

    Args:
        param1 (str): Description of param1.
        param2 (int): Description of param2.

    Returns:
        bool: Description of the return value.
    """
    return True