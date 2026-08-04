# Docker Deployment Guide

This guide explains how to use Covate with Docker.

## Quick Start

### 1. Build the Image

```bash
docker build -t covate .
```

### 2. Run with Docker

For interactive use:

```bash
docker run -i covate
```

### 3. Run with Docker Compose

```bash
docker-compose up -d
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MCP_DEBUG` | `false` | Enable debug logging |
| `HOME` | `/data` | Home directory for persistent storage |

### Volume Mounts

Mount your project directory to allow the MCP server to access your code:

```bash
docker run -i \
  -v $(pwd):/workspace \
  -w /workspace \
  covate
```

## Using with Claude Desktop

Add this configuration to your Claude Desktop MCP settings:

### macOS/Linux

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "covate": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-v",
        "/path/to/your/project:/workspace",
        "-w",
        "/workspace",
        "covate"
      ]
    }
  }
}
```

### Windows

Edit `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "covate": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-v",
        "C:\\path\\to\\your\\project:/workspace",
        "-w",
        "/workspace",
        "covate"
      ]
    }
  }
}
```

## Persistent Storage

By default, learning sessions and debug records are stored in `/data/.mcp-sidecar` inside the container.

To persist this data:

```bash
docker run -i \
  -v mcp-data:/data/.mcp-sidecar \
  covate
```

Or use the provided docker-compose.yml which includes a named volume.

## Publishing to Docker Hub

To share your image on Docker Hub:

```bash
# Tag the image
docker tag covate:latest your-username/covate:latest

# Push to Docker Hub
docker push your-username/covate:latest
```

## Glama.ai Integration

This Docker setup is optimized for use with [Glama.ai](https://glama.ai/mcp/servers/@SunflowersLwtech/covate).

Users can pull and run your MCP server directly:

```bash
docker pull sunflowerslwtech/covate:latest
docker run -i sunflowerslwtech/covate:latest
```

## Troubleshooting

### Server Not Responding

Check if the container is running:

```bash
docker ps -a
```

View logs:

```bash
docker logs covate
```

### Permission Issues

Ensure volumes have proper permissions:

```bash
docker run -i -u $(id -u):$(id -g) \
  -v $(pwd):/workspace \
  covate
```

### Debug Mode

Enable debug logging:

```bash
docker run -i -e MCP_DEBUG=true covate
```

## Security Considerations

- The default Dockerfile runs as root. For production, consider creating a non-root user.
- Mount volumes as read-only (`:ro`) when possible to limit container access.
- Use specific tags instead of `latest` for reproducible builds.

## Building for Multiple Architectures

To build multi-platform images (e.g., for ARM and x86):

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t your-username/covate:latest \
  --push .
```
