![Python Version](https://img.shields.io/badge/python-3.10%2B-green)


# PromptLab

**PromptLab** is a professional prompt engineering platform designed for AI engineers to store, organize, and manage complex AI prompts. Think of it as **"Postman for Prompts"**—a centralized workspace to manage prompt lifecycles, variables, and versioning.

---

## 🚀 Project Overview & Purpose

In modern AI development, prompts are as important as code. PromptLab provides a structured environment to:

* **Centralize Knowledge:** Stop losing valuable prompts in chat histories or local text files.
* **Variable Injection:** Define templates with `{{dynamic_variables}}` for automated workflows and testing.
* **Organizational Hierarchy:** Group prompts into logical **Collections** for different projects, clients, or use cases.
* **API-First Design:** Easily integrate stored prompts into other applications via a clean, high-performance FastAPI interface.
* **Audit Readiness:** Track when prompts were created and last modified to maintain high quality in production environments.

---

## ✨ Features

* **Full CRUD Lifecycle:** Create, Read, Update, and Delete prompts and collections with ease.
* **Partial Updates (PATCH):** Update specific fields (like just the `description` or `title`) without sending the entire object payload.
* **Smart Search & Filtering:** Find prompts instantly using keywords or by filtering through specific collections.
* **In-Memory Storage:** High-speed data handling designed for rapid prototyping (architecture ready for SQL/NoSQL migration).
* **Automatic Audit Trails:** Every change automatically updates the `updated_at` timestamp.
* **Self-Documenting API:** Full integration with Swagger UI and ReDoc for interactive testing.

---

## 📦 Prerequisites & Installation

### Prerequisites

Before setting up the project, ensure you have the following installed:

* **Python 3.10+** — Core backend language
* **pip** — Python package installer
* **Git** — Version control

### Installation

Follow these steps to get your development environment running:

#### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd promptlab
```

#### 2️⃣ Set Up a Virtual Environment

Using a virtual environment is strongly recommended.

```bash
python -m venv venv

# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

#### 3️⃣ Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

---

## ⚡ Quick Start Guide

### 1️⃣ Start the API Server

```bash
cd backend
python main.py
```

### 2️⃣ Verify the Connection

Open your browser and navigate to:

```
http://localhost:8000/health
```

You should see a `"healthy"` status.

### 3️⃣ Interactive API Documentation

FastAPI automatically generates interactive docs:

* **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📋 API Endpoint Summary & Examples

### 1. Prompts API

Manage your AI prompt templates.

| Method | Endpoint | Description | Example |
| --- | --- | --- | --- |
| `GET` | `/prompts` | List all prompts | `curl http://localhost:8000/prompts` |
| `POST` | `/prompts` | Create a new prompt | [See Example](#post-create) |
| `GET` | `/prompts/{id}` | Get a single prompt | `curl http://localhost:8000/prompts/123` |
| `PUT` | `/prompts/{id}` | Replace/Update prompt | [See Example](#put-update) |
| `PATCH` | `/prompts/{id}` | Partial update | [See Example](#patch-update) |
| `DELETE` | `/prompts/{id}` | Delete a prompt | `curl -X DELETE http://localhost:8000/prompts/123` |

#### <a name="post-create"></a> 🆕 Create a Prompt (POST)

```bash
curl -X POST "http://localhost:8000/prompts" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Email Summarizer",
       "content": "Summarize the following email in 3 bullet points: {{email_body}}",
       "description": "Used for daily digest automation"
     }'

```

#### <a name="put-update"></a> 🔄 Full Update (PUT)

*Note: Requires sending all fields.*

```bash
curl -X PUT "http://localhost:8000/prompts/YOUR_ID" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Email Summarizer v2",
       "content": "Summarize this email in 5 bullet points: {{email_body}}",
       "description": "Updated for better detail"
     }'

```

#### <a name="patch-update"></a> 🛠️ Partial Update (PATCH)

*Note: Only send the fields you want to change.*

```bash
curl -X PATCH "http://localhost:8000/prompts/YOUR_ID" \
     -H "Content-Type: application/json" \
     -d '{"title": "Fast Email Summarizer"}'

```

---

### 2. Collections API

Organize prompts into logical groups.

| Method | Endpoint | Description | Example |
| --- | --- | --- | --- |
| `GET` | `/collections` | List all collections | `curl http://localhost:8000/collections` |
| `POST` | `/collections` | Create a collection | [See Example](#post-col) |
| `DELETE` | `/collections/{id}` | Delete collection | `curl -X DELETE http://localhost:8000/collections/456` |

#### <a name="post-col"></a> 📁 Create a Collection (POST)

```bash
curl -X POST "http://localhost:8000/collections" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Marketing Tools",
       "description": "Prompts for the social media team"
     }'

```

---

### 3. Utility

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Check if the API is running correctly |

---

## 🛠️ Development Setup

### Running Tests

We use **pytest** to ensure high code quality.

```bash
cd backend
pytest tests/ -v
```

---

### Project Structure

```
promptlab/
├── README.md
├── PROJECT_BRIEF.md
├── GRADING_RUBRIC.md
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── api.py
│   │   ├── models.py
│   │   ├── storage.py
│   │   └── utils.py
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_api.py
│   │   └── conftest.py
│   ├── main.py
│   └── requirements.txt
│
├── frontend/        
├── specs/           
├── docs/            
└── .github/         
```

---

## 💻 Tech Stack

* **Backend:** Python 3.10+, FastAPI, Pydantic
* **Frontend:** React, Vite, Tailwind CSS (Week 4)
* **Testing:** Pytest, Coverage.py
* **DevOps:** Docker, GitHub Actions, Shields.io

---

## 🤝 Contributing Guidelines

We follow a strict **Spec-First** development approach.

1. **Branching:** Create a descriptive branch name (e.g., `feat/add-tagging-system`).
2. **Standards:** All code must pass **Flake8** linting and follow **Google-style docstring** requirements.
3. **Testing:** New features must include unit tests. Coverage must not drop below **80%**.
4. **Documentation:** Update `docs/API_REFERENCE.md` if endpoint signatures change.
5. **Pull Requests:** Submit a PR against the `main` branch for review.

---
