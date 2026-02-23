FROM python:3.11-slim

WORKDIR /app

# Copy requirements from the backend folder to /app/
COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy everything INSIDE backend/ into /app/
# This puts main.py and the app/ folder at the same level
COPY . .

EXPOSE 8000

# Run main:app because main.py is now at the root of /app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]