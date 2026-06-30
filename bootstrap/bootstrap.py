from pathlib import Path

ROOT = Path.cwd()

directories = [
    ".github/workflows",
    ".github/ISSUE_TEMPLATE",
    "backend",
    "frontend",
    "browser-extension",
    "plugins",
    "database",
    "docker",
    "tests",
    "configs",
    "assets",
    "assets/icons",
    "assets/logos",
    "assets/screenshots",
    "design",
    "design/architecture",
    "design/database",
    "design/ui",
    "docs",
    "handbook",
    "handbook/volume-1-product",
    "handbook/volume-2-architecture",
    "handbook/volume-3-engineering",
    "handbook/volume-4-operations",
    "handbook/volume-5-developer-guide",
    "adr",
    "rfc",
    "scripts",
    "templates",
    "examples",
    "requirements",
]

files = [
    "README.md",
    "CHANGELOG.md",
    "CONTRIBUTING.md",
    "LICENSE",
    "ROADMAP.md",
    ".gitignore",
    "docker-compose.yml",
    "pyproject.toml",
    "mkdocs.yml",
    ".env.example",
    "requirements/base.txt",
    "requirements/dev.txt",
    "requirements/test.txt",
    "requirements/docs.txt",
    "requirements/ai.txt",
]

for directory in directories:
    (ROOT / directory).mkdir(parents=True, exist_ok=True)

for file in files:
    path = ROOT / file
    path.parent.mkdir(parents=True, exist_ok=True)
    path.touch(exist_ok=True)

print("✅ AnalyticsOS repository structure created successfully.")

