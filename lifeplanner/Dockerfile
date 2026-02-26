# LifePlanner Dockerfile
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ ./src/
COPY data/ ./data/

# Create data directory if it doesn't exist
RUN mkdir -p data

# Set Python path
ENV PYTHONPATH=/app

# Create non-root user
RUN useradd --create-home --shell /bin/bash lifeplanner
RUN chown -R lifeplanner:lifeplanner /app
USER lifeplanner

# Expose port (if needed for future web interface)
EXPOSE 8000

# Default command
CMD ["python", "-m", "src.cli.life_planner_cli", "--help"]

