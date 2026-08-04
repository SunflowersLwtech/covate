# Covate - Dockerfile
# This image provides a ready-to-use MCP server for learning and debugging assistance

FROM python:3.11-slim

# Set metadata
LABEL org.opencontainers.image.source="https://github.com/SunflowersLwtech/covate"
LABEL org.opencontainers.image.description="Context-aware MCP server for AI coding assistant learning"
LABEL org.opencontainers.image.licenses="MIT"

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        git \
        ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy dependency files first (for better layer caching)
COPY pyproject.toml README.md ./

# Copy source code
COPY src/ ./src/

# Install the package and dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir .

# Create directory for persistent storage
RUN mkdir -p /data/.mcp-sidecar && \
    chmod 777 /data/.mcp-sidecar

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    MCP_DEBUG=false \
    HOME=/data

# Health check (optional, for when running as HTTP service)
# HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
#   CMD python -c "import covate; print('OK')" || exit 1

# Run the MCP server via stdio
ENTRYPOINT ["covate"]

# Note: MCP servers communicate via stdin/stdout by default
# To use this container with Claude Desktop or other MCP clients:
# 1. Build: docker build -t covate .
# 2. Configure in your MCP client to run: docker run -i covate
