# Covate - Windows Installation Script
# Usage: irm https://raw.githubusercontent.com/SunflowersLwtech/covate/main/scripts/install.ps1 | iex
# Or: .\scripts\install.ps1
#
# Parameters:
#   -InstallPath - Custom installation path (default: ~/covate)
#   -UseUV       - Force use uv
#   -UseConda    - Force use conda

param(
    [string]$InstallPath = "$env:USERPROFILE\covate",
    [switch]$UseUV,
    [switch]$UseConda
)

$ErrorActionPreference = "Stop"
$PythonVersionRequired = "3.11"
$EnvManager = ""
$ScriptPath = ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Covate - Installation Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# CHECK FOR EXISTING INSTALLATION
# ============================================================================

function Find-ExistingInstallation {
    $candidates = @()

    # Check default installation path
    if (Test-Path "$InstallPath\.env_manager") {
        $candidates += $InstallPath
    }

    # Check pip installation
    try {
        $pipShow = pip show covate 2>$null
        if ($pipShow) {
            $editableLocation = $pipShow | Select-String "Editable project location:"
            if ($editableLocation) {
                $pipPath = ($editableLocation -split ":", 2)[1].Trim()
                if (Test-Path $pipPath) {
                    $candidates += $pipPath
                }
            }
        }
    } catch {}

    # Check common alternative locations
    $altPaths = @(
        "$env:USERPROFILE\Documents\covate",
        "$env:USERPROFILE\Desktop\covate",
        "$env:USERPROFILE\Projects\covate"
    )
    foreach ($path in $altPaths) {
        if (Test-Path "$path\.env_manager") {
            $candidates += $path
        }
    }

    # Remove duplicates
    $uniqueCandidates = $candidates | Select-Object -Unique

    return $uniqueCandidates
}

Write-Host "Checking for existing installation..." -ForegroundColor Gray

$existingInstallations = Find-ExistingInstallation

if ($existingInstallations.Count -gt 0) {
    Write-Host ""
    Write-Host "Existing installation detected!" -ForegroundColor Yellow
    Write-Host ""

    foreach ($installation in $existingInstallations) {
        Write-Host "  Found: $installation" -ForegroundColor Cyan
        if (Test-Path "$installation\src\covate\__init__.py") {
            $content = Get-Content "$installation\src\covate\__init__.py" -Raw
            if ($content -match '__version__\s*=\s*"([^"]+)"') {
                Write-Host "  Version: $($Matches[1])" -ForegroundColor Gray
            }
        }
    }

    Write-Host ""
    Write-Host "Running update instead of fresh installation..." -ForegroundColor Cyan
    Write-Host ""

    # Download and execute update script
    try {
        Write-Host "Downloading update script from GitHub..." -ForegroundColor Gray
        $updateScript = Invoke-RestMethod -Uri "https://raw.githubusercontent.com/SunflowersLwtech/covate/main/scripts/update.ps1" -ErrorAction Stop

        if ([string]::IsNullOrWhiteSpace($updateScript)) {
            throw "Downloaded script is empty"
        }

        Write-Host "Executing remote update script..." -ForegroundColor Gray
        Invoke-Expression $updateScript
        exit 0
    } catch {
        Write-Host ""
        Write-Host "Failed to download remote update script: $_" -ForegroundColor Yellow
        Write-Host "Trying local update script..." -ForegroundColor Yellow
        Write-Host ""

        $localUpdateScript = Join-Path $existingInstallations[0] "scripts\update.ps1"
        if (Test-Path $localUpdateScript) {
            & $localUpdateScript
            exit 0
        } else {
            Write-Host "Error: Local update script not found at: $localUpdateScript" -ForegroundColor Red
            Write-Host "Skipping update and continuing with fresh installation..." -ForegroundColor Yellow
            Write-Host ""
        }
    }
}

Write-Host "No existing installation found. Proceeding with fresh installation..." -ForegroundColor Green
Write-Host ""

# Function to check Python version
function Test-PythonVersion {
    param([string]$PythonCmd)
    try {
        $version = & $PythonCmd --version 2>&1
        if ($version -match "Python (\d+)\.(\d+)") {
            $major = [int]$Matches[1]
            $minor = [int]$Matches[2]
            if ($major -ge 3 -and $minor -ge 11) {
                return "$major.$minor"
            }
        }
    } catch {}
    return $null
}

# Function to install uv
function Install-UV {
    Write-Host "  Installing uv..." -ForegroundColor Yellow
    irm https://astral.sh/uv/install.ps1 | iex
    $env:Path = "$env:USERPROFILE\.local\bin;$env:Path"
}

# Step 1: Detect or install environment manager
Write-Host "[1/4] Setting up Python environment..." -ForegroundColor Yellow

if ($UseUV) {
    $EnvManager = "uv"
    if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
        Install-UV
    }
} elseif ($UseConda) {
    $EnvManager = "conda"
    if (-not (Get-Command conda -ErrorAction SilentlyContinue)) {
        Write-Host "Error: -UseConda specified but conda is not installed." -ForegroundColor Red
        Write-Host "Please install Miniconda: https://docs.conda.io/en/latest/miniconda.html" -ForegroundColor Yellow
        exit 1
    }
} else {
    # Auto-detect: prefer uv > conda > system python
    if (Get-Command uv -ErrorAction SilentlyContinue) {
        $EnvManager = "uv"
        Write-Host "  Detected: uv" -ForegroundColor Green
    } elseif (Get-Command conda -ErrorAction SilentlyContinue) {
        $EnvManager = "conda"
        Write-Host "  Detected: conda" -ForegroundColor Green
    } elseif (Get-Command python -ErrorAction SilentlyContinue) {
        $version = Test-PythonVersion "python"
        if ($version) {
            $EnvManager = "venv"
            Write-Host "  Detected: Python $version (using venv)" -ForegroundColor Green
        } else {
            Write-Host "  System Python is too old. Installing uv..." -ForegroundColor Yellow
            Install-UV
            $EnvManager = "uv"
        }
    } else {
        Write-Host "  No Python found. Installing uv..." -ForegroundColor Yellow
        Install-UV
        $EnvManager = "uv"
    }
}

Write-Host "  Using: $EnvManager" -ForegroundColor Cyan

# Step 2: Clone or update repository
Write-Host ""
Write-Host "[2/4] Setting up repository..." -ForegroundColor Yellow
if (Test-Path $InstallPath) {
    Write-Host "  Directory exists. Updating..." -ForegroundColor Gray
    Push-Location $InstallPath
    try {
        $gitOutput = git pull origin main 2>&1
        if ($LASTEXITCODE -eq 0 -or $gitOutput -match "Already up to date") {
            Write-Host "  Repository updated." -ForegroundColor Green
        } else {
            Write-Host "  Warning: Git pull encountered issues, continuing..." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  Warning: Git pull failed, continuing with existing code..." -ForegroundColor Yellow
    }
    Pop-Location
} else {
    Write-Host "  Cloning repository..." -ForegroundColor Gray
    git clone https://github.com/SunflowersLwtech/covate.git $InstallPath
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to clone repository" -ForegroundColor Red
        exit 1
    }
}

Push-Location $InstallPath

# Step 3: Create virtual environment
Write-Host ""
Write-Host "[3/4] Creating virtual environment..." -ForegroundColor Yellow

switch ($EnvManager) {
    "uv" {
        if (-not (Test-Path "covate")) {
            uv venv --python $PythonVersionRequired covate
            Write-Host "  Virtual environment created with Python $PythonVersionRequired" -ForegroundColor Green
        } else {
            Write-Host "  Virtual environment already exists." -ForegroundColor Gray
        }
        $ScriptPath = "$InstallPath\covate\Scripts\covate.exe"
    }
    "conda" {
        $envExists = conda env list | Select-String "covate"
        if (-not $envExists) {
            conda create -n covate python=$PythonVersionRequired -y
            Write-Host "  Conda environment created." -ForegroundColor Green
        } else {
            Write-Host "  Conda environment already exists." -ForegroundColor Gray
        }
        # Get conda env path
        $condaInfo = conda env list | Select-String "covate"
        $CondaEnvPath = ($condaInfo -split '\s+')[-1]
        $ScriptPath = "$CondaEnvPath\Scripts\covate.exe"
    }
    "venv" {
        if (-not (Test-Path "covate")) {
            python -m venv covate
            Write-Host "  Virtual environment created." -ForegroundColor Green
        } else {
            Write-Host "  Virtual environment already exists." -ForegroundColor Gray
        }
        $ScriptPath = "$InstallPath\covate\Scripts\covate.exe"
    }
}

# Step 4: Install dependencies
Write-Host ""
Write-Host "[4/4] Installing dependencies..." -ForegroundColor Yellow

switch ($EnvManager) {
    "uv" {
        uv pip install -e '.[dev]' --quiet
    }
    "conda" {
        conda activate covate
        pip install -e '.[dev]' --quiet
        conda deactivate
    }
    "venv" {
        & ".\covate\Scripts\pip.exe" install -e '.[dev]' --quiet
    }
}

Write-Host "  Dependencies installed." -ForegroundColor Green

# Save environment manager info for update script
$EnvManager | Out-File -FilePath "$InstallPath\.env_manager" -Encoding UTF8 -NoNewline

Pop-Location

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  Installation Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Environment: $EnvManager" -ForegroundColor Cyan
Write-Host "Command:     $ScriptPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Configure Your IDE" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "For Claude Code (one command):" -ForegroundColor Yellow
Write-Host "  claude mcp add covate -- `"$ScriptPath`"" -ForegroundColor White
Write-Host ""
Write-Host "For other IDEs (Cursor, Windsurf, etc.), add this to MCP config:" -ForegroundColor Yellow
Write-Host "  {" -ForegroundColor Gray
Write-Host "    `"covate`": {" -ForegroundColor Gray
Write-Host "      `"command`": `"$($ScriptPath -replace '\\', '\\\\')`"" -ForegroundColor Gray
Write-Host "    }" -ForegroundColor Gray
Write-Host "  }" -ForegroundColor Gray
Write-Host ""
Write-Host "To update later, run:" -ForegroundColor Yellow
Write-Host "  $InstallPath\scripts\update.ps1" -ForegroundColor White
Write-Host ""
