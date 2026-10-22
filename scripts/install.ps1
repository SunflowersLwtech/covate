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

# PowerShell does not stop when a native command (git, uv, pip) fails, so every one
# of them is checked by hand. Throwing rather than `exit` keeps the message on screen
# when the script runs through `irm | iex`, and still exits non-zero from -File/-Command.
function Stop-Install {
    param([string]$Message)
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Red
    Write-Host "  Installation FAILED" -ForegroundColor Red
    Write-Host "================================================" -ForegroundColor Red
    Write-Host "  $Message" -ForegroundColor Red
    Write-Host ""
    Write-Host "Nothing was configured. Fix the error above and run the installer again." -ForegroundColor Yellow
    throw "Covate installation failed: $Message"
}

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Covate - Installation Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# CHECK FOR EXISTING INSTALLATION
# ============================================================================

# A clone is not an installation: .env_manager ships in the repository, so a run
# that failed after cloning leaves one behind. Count a path only once its
# environment has the covate command.
function Test-Installed {
    param([string]$Path)
    if (-not (Test-Path "$Path\.env_manager")) { return $false }
    foreach ($exe in @("covate\Scripts\covate.exe", ".venv\Scripts\covate.exe", "venv\Scripts\covate.exe")) {
        if (Test-Path (Join-Path $Path $exe)) { return $true }
    }
    $manager = (Get-Content "$Path\.env_manager" -Raw).Trim()
    if ($manager -eq "conda" -and (Get-Command conda -ErrorAction SilentlyContinue)) {
        return [bool](conda env list | Select-String "covate")
    }
    return $false
}

function Find-ExistingInstallation {
    $candidates = @()

    # Check default installation path
    if (Test-Installed $InstallPath) {
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
        if (Test-Installed $path) {
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
        Stop-Install "Could not clone the repository."
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
            if ($LASTEXITCODE -ne 0) { Stop-Install "uv could not create a Python $PythonVersionRequired environment." }
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
            if ($LASTEXITCODE -ne 0) { Stop-Install "conda could not create the environment 'covate'." }
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
            if ($LASTEXITCODE -ne 0) { Stop-Install "python could not create a virtual environment." }
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
        # uv pip only finds an environment that is activated or named .venv; this one is
        # neither, so name its interpreter.
        uv pip install --python "$InstallPath\covate\Scripts\python.exe" -e '.[dev]' --quiet
        if ($LASTEXITCODE -ne 0) { Stop-Install "uv could not install covate into $InstallPath\covate." }
    }
    "conda" {
        conda activate covate
        pip install -e '.[dev]' --quiet
        if ($LASTEXITCODE -ne 0) { Stop-Install "pip could not install covate into the conda environment 'covate'." }
        conda deactivate
    }
    "venv" {
        & ".\covate\Scripts\pip.exe" install -e '.[dev]' --quiet
        if ($LASTEXITCODE -ne 0) { Stop-Install "pip could not install covate into $InstallPath\covate." }
    }
}

# Report what is on disk, not what the steps above meant to do. A venv keeps python.exe
# next to covate.exe in Scripts\; a conda environment keeps it at the environment root.
# -I keeps the current directory off sys.path: from here, the environment's own .\covate
# folder would import as an empty namespace package and pass for an installation.
if (-not (Test-Path $ScriptPath)) { Stop-Install "$ScriptPath was not created." }
$EnvPython = if ($EnvManager -eq "conda") { Join-Path $CondaEnvPath "python.exe" } else { Join-Path (Split-Path $ScriptPath) "python.exe" }
if (-not (Test-Path $EnvPython)) { Stop-Install "$EnvPython was not found." }
& $EnvPython -I -c "import covate.server"
if ($LASTEXITCODE -ne 0) { Stop-Install "covate does not import with $EnvPython." }

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
# JSON escapes each backslash once. -replace takes a regex ('\\' matches one backslash)
# but a literal replacement, so '\\' there is two backslashes, not one escaped.
Write-Host "      `"command`": `"$($ScriptPath -replace '\\', '\\')`"" -ForegroundColor Gray
Write-Host "    }" -ForegroundColor Gray
Write-Host "  }" -ForegroundColor Gray
Write-Host ""
Write-Host "To update later, run:" -ForegroundColor Yellow
Write-Host "  $InstallPath\scripts\update.ps1" -ForegroundColor White
Write-Host ""
