# Feature Specification: Tagging System

## 1. Overview
The Tagging System provides a flexible way to categorize prompts using multiple labels. Unlike Collections, which are mutually exclusive (a prompt belongs to one collection), Tags allow for a many-to-many relationship. This is essential for tracking prompts by LLM provider (e.g., `openai`), status (e.g., `deprecated`), or project stage (e.g., `experimental`).

---

## 2. User Stories & Acceptance Criteria

| ID | User Story | Acceptance Criteria |
| :--- | :--- | :--- |
| **US 1** | As a user, I want to add tags to a prompt. | - Users can add a list of strings during creation/update.<br>- System prevents duplicate tags on a single prompt. |
| **US 2** | As a dev, I want to filter by tags. | - The `/prompts` endpoint accepts a `tags` query parameter.<br>- Filtering supports multiple tags simultaneously. |
| **US 3** | As a lead, I want to see all used tags. | - A new endpoint returns a unique list of all tags used in the system. |

---

## 3. Data Model Changes

### Updated `Prompt` Schema
The `Prompt` model (and its variations in `models.py`) must be updated to include:

* **Field:** `tags`
* **Type:** `List[str]`
* **Constraints:**
  - Default to an empty list `[]`.
  - Maximum 20 characters per tag.
  - Tags should be "slugified" (lowercase, no spaces).

### Database-Level Constraints
In addition to application-level validation, database-level constraints should be implemented where possible to enforce:
- Maximum tag length (20 characters).
- Allowed characters (alphanumeric and hyphens only).
- Maximum 10 tags per prompt.
- Case normalization (stored as lowercase).

These constraints ensure data integrity even if validation is bypassed at the API layer.

---

## 4. API Endpoint Specifications

### `GET /prompts?tags=tag1,tag2`
* **Modification:** Add `tags` as an optional query parameter.
* **Functionality:** Filter results to only include prompts that contain the specified tags.

#### Example Request
```
GET /prompts?tags=production,openai
```

#### Example Response
```json
[
  {
    "id": 1,
    "title": "OpenAI Production Prompt",
    "tags": ["production", "openai"]
  }
]
```

---

### `GET /tags`
* **New Endpoint:** Returns a unique list of all tags currently existing in the database.

#### Response Format:
```json
{
  "tags": ["production", "bug", "gpt-4", "experimental"],
  "total": 4
}
```

---

### `PATCH /prompts/{id}`
* **Requirement:** Ensure the existing PATCH logic correctly handles the `tags` list (replacing the old list with the new one provided).
* The PATCH operation must **replace** the existing tag list entirely with the provided list.
* Sending `{"tags": []}` must remove all tags from the prompt.

#### Example Request
```json
PATCH /prompts/1

{
  "tags": ["production", "experimental"]
}
```

#### Example Response
```json
{
  "id": 1,
  "tags": ["production", "experimental"]
}
```

---

## 5. Search & Filter Requirements

* **Logic Type:** The system will use **AND** logic for multiple tags. If a user filters for `production,openai`, only prompts containing **both** tags will be returned.
* **Case Sensitivity:** All tag searches must be case-insensitive.
* **Sanitization:** Leading/trailing spaces must be trimmed, and spaces should be replaced with hyphens before saving to storage.
* **Duplicate Handling:** Duplicate tags in query parameters should be ignored during filtering.

---

## 6. Error Handling

The API must return appropriate validation errors when invalid tags are provided.

### Validation Rules
- Tags exceeding 20 characters must be rejected.
- Tags containing invalid characters (non-alphanumeric except hyphens) must be rejected.
- More than 10 tags per prompt must be rejected.
- Duplicate tags in a single request must be rejected or deduplicated before validation.

### Suggested Status Codes
- `400 Bad Request` — Invalid tag format, length, or character violation.
- `422 Unprocessable Entity` — Validation errors for exceeding limits.
- `404 Not Found` — If the prompt ID does not exist during PATCH.

Example error response:
```json
{
  "error": "Invalid tag format. Tags must be lowercase, alphanumeric, and may include hyphens only."
}
```

---

## 7. Edge Cases

* **Empty Tag List:** Sending `{"tags": []}` should be allowed and will remove all tags from the prompt.
* **Max Tags:** Limit a single prompt to a maximum of 10 tags to prevent metadata bloat.
* **Special Characters:** Reject tags containing non-alphanumeric characters (except hyphens).
* **Large Dataset Filtering:** Ensure filtering remains performant with a high volume of prompts and tags.

---

## 8. Testing Considerations

Testing must cover:

### Functional Tests
- Adding valid tags during prompt creation.
- Updating tags via PATCH (replacement behavior).
- Removing all tags using an empty list.
- Filtering prompts using single and multiple tags.
- Case-insensitive filtering.

### Validation Tests
- Tag length > 20 characters.
- Tags containing invalid characters.
- More than 10 tags on a prompt.
- Duplicate tags in the same request.

### Edge Case Tests
- Filtering with tags that do not exist.
- Filtering with partially matching tags (should not match).
- Maximum tags added to a single prompt.
- Whitespace handling and sanitization behavior.

### Performance Tests
- Filtering performance with large numbers of prompts.
- GET /tags performance with large tag datasets.

---
