# Feature Specification: Prompt Versioning

## 1. Overview
Prompt Versioning allows users to track the evolution of a prompt over time. Instead of overwriting data, every major update to a prompt's content creates a historical snapshot. This provides an audit trail, prevents accidental data loss, and allows for A/B testing between different versions of a prompt.

## 2. User Stories & Acceptance Criteria

| ID | User Story | Acceptance Criteria |
| :--- | :--- | :--- |
| **US 1** | As a user, I want to see a list of all historical changes to a prompt. | - A `/versions` endpoint returns all snapshots for a specific prompt ID.<br>- Each entry includes a timestamp and the version number. |
| **US 2** | As a user, I want to view the full content of an old version. | - Users can retrieve a specific version by its unique `version_id`. |
| **US 3** | As a user, I want to revert the current prompt to a previous state. | - Clicking 'revert' creates a **new** version (v+1) that matches the selected old version. |
| **US 4** | As a dev, I want to compare two versions side-by-side. | - System provides a "diff" view highlighting added/removed text between two version IDs. |

## 3. Data Model Changes

### New `PromptVersion` Model
* **version_id:** `str` (UUID)
* **prompt_id:** `str` (Foreign Key link to the main Prompt)
* **version_number:** `int` (Auto-incrementing per prompt)
* **content:** `str` (The prompt text at that point in time)
* **created_at:** `datetime`
* **change_summary:** `str` (Optional note from the user about what changed)



## 4. API Endpoint Specifications

### `GET /prompts/{prompt_id}/versions`
- **Description:** Returns a list of all versions for the specified prompt.
- **Response:** `{"versions": [...], "total": X}`

### `GET /prompts/{prompt_id}/versions/{version_id}`
- **Description:** Retrieves the full content of a specific historical version.

### `POST /prompts/{prompt_id}/versions/{version_id}/revert`
- **Description:** Sets the "active" content of the prompt to the content found in `version_id`.
- **Note:** This should trigger a new version entry to maintain a continuous history.

### `GET /prompts/{prompt_id}/compare?v1={id}&v2={id}`
- **Description:** Returns a comparison object showing lines added/removed between two versions.

## 5. Edge Cases to Handle
- **Cascading Deletes:** If a Prompt is deleted, all its associated versions must also be purged from storage.
- **Immutable History:** Old versions should be read-only; they cannot be edited, only viewed or reverted to.
- **Empty Changes:** If a user saves a prompt without changing the content, a new version should **not** be created.
- **Concurrency:** If two users try to revert to different versions at the same time, the system must handle the timestamping correctly.

## 6. Search & Filtering
- Version history should be sorted by `version_number` in descending order (newest first) by default.