
# PromptLab API Reference

**Version:** 1.0.0  
**AI Prompt Engineering Platform** | Base URL: `/api/v1`

## Table of Contents
- [Authentication](#authentication)
- [Error Formats](#error-formats)
- [Health Check](#health-check)
- [Prompt Endpoints](#prompt-endpoints)
- [Collection Endpoints](#collection-endpoints)
- [Validation Rules](#validation-rules)
- [OpenAPI Docs](#openapi-docs)

---

## Authentication {#authentication}

**None required** (public API)

---

## Error Formats {#error-formats}

```json
{
  "detail": "Descriptive error message"
}
```

| Code | Description |
|------|-------------|
| **400** | Bad Request, missing PATCH fields, invalid collection |
| **404** | Resource not found |
| **422** | Validation failed (length, types) |

---

## Health Check {#health-check}

### `GET /health`

**Response (200)** `HealthResponse`:
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

---

## Prompt Endpoints {#prompt-endpoints}

### `GET /prompts`
List prompts **(sorted newest first by `updated_at`)**

**Query Parameters**:
| Name | Type | Description |
|------|------|-------------|
| `collection_id` | string | Filter by collection |
| `search` | string | Search content |

**Response (200)** `PromptList`:
```json
{
  "prompts": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Blog Post Generator",
      "content": "Write a 1000-word blog post about AI prompt engineering...",
      "description": "SEO-optimized blog template",
      "collection_id": "123e4567-e89b-12d3-a456-426614174000",
      "created_at": "2026-02-18T14:30:00Z",
      "updated_at": "2026-02-18T14:30:00Z"
    }
  ],
  "total": 1
}
```

### `GET /prompts/{prompt_id}`

**Response (200)** `Prompt`:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Blog Post Generator",
  "content": "Write a 1000-word blog post...",
  "description": "SEO-optimized blog template",
  "collection_id": "123e4567-e89b-12d3-a456-426614174000",
  "created_at": "2026-02-18T14:30:00Z",
  "updated_at": "2026-02-18T14:30:00Z"
}
```

### `POST /prompts`
**Validates collection exists if provided**

**Request** `PromptCreate`:
```json
{
  "title": "Python Expert Prompt",
  "content": "You are a senior Python developer with 10+ years experience...",
  "description": "Code review and debugging assistant",
  "collection_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Response (201)** `Prompt` (with auto-generated ID/timestamps)

### `PUT /prompts/{prompt_id}`
**Full replace** (all fields required)

**Request** `PromptUpdate`:
```json
{
  "title": "Enhanced Python Expert",
  "content": "Updated prompt content...",
  "description": "Advanced Python coding assistant",
  "collection_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

### `PATCH /prompts/{prompt_id}`
**Partial update** (≥1 field required)

**Request** `PromptPatch`:
```json
{
  "title": "Quick Title Update",
  "description": "Updated description"
}
```

### `DELETE /prompts/{prompt_id}`

**Response**: `204 No Content`

---

## Collection Endpoints {#collection-endpoints}

### `GET /collections`

**Response (200)** `CollectionList`:
```json
{
  "collections": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Content Creation",
      "description": "Blog, social media, and marketing prompts",
      "created_at": "2026-02-18T14:00:00Z"
    }
  ],
  "total": 1
}
```

### `GET /collections/{collection_id}`

**Response (200)** `Collection`:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Content Creation",
  "description": "Blog, social media, and marketing prompts",
  "created_at": "2026-02-18T14:00:00Z"
}
```

### `POST /collections`

**Request** `CollectionCreate`:
```json
{
  "name": "Code Generation",
  "description": "Programming and development prompts"
}
```

**Response (201)** `Collection`

### `DELETE /collections/{collection_id}`
**⚠️ Deletes collection + ALL prompts inside it**

**Response**: `204 No Content`

---

## Validation Rules {#validation-rules}

| Field | Constraints |
|-------|-------------|
| `title` | 1-200 chars |
| `content` | ≥1 char |
| `name` | 1-100 chars |
| `description` | ≤500 chars (nullable) |
| `id` | UUID v4 |
| Timestamps | UTC ISO 8601 |

---

## OpenAPI Docs {#openapi-docs}

- **Swagger UI**: `/docs`
- **ReDoc**: `/redoc`

## Features

- ✅ **UUID v4** auto-generation
- ✅ **UTC timestamps**
- ✅ **Newest-first sorting**
- ✅ **Content search**
- ✅ **CORS** (all origins/methods)
- ✅ **Pydantic validation**
- ✅ **Collection validation** on prompt create/update

---

