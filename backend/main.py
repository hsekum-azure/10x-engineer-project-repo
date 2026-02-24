"""PromptLab API Server

Run with: python main.py
"""

import uvicorn

if __name__ == "__main__":
    # Use the string "app.api:app"
    # "app.api" tells python to look in the app/ folder for api.py
    # ":app" tells it to find the FastAPI() variable named 'app'
    uvicorn.run("app.api:app", host="0.0.0.0", port=8000, reload=True)