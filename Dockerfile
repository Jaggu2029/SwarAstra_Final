FROM python:3.11-slim

# Install ALL system graphic libraries required by MediaPipe & OpenCV on modern Debian
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libegl1 \
    libgles2 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/SwarAstra

COPY SwarAstra/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY SwarAstra/ .

EXPOSE 5000

CMD gunicorn --bind 0.0.0.0:${PORT:-5000} --workers 1 --timeout 120 model_api:app
