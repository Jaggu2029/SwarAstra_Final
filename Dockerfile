FROM python:3.11-slim

# Install system graphic libraries required by MediaPipe & OpenCV
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgles2-mesa \
    libgl1-mesa-glx \
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

CMD ["python", "model_api.py"]
