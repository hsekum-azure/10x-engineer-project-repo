"""PromptLab API Server

Run with: python main.py
"""

import uvicorn
from app.api import app
from app.seed_data import seed_initial_data

# Seed in-memory storage with initial data
#seed_initial_data() #uncommnet this line to have some data init

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
